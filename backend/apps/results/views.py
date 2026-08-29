from rest_framework import viewsets, permissions, status, decorators
from rest_framework.response import Response
from apps.results.models import StudentResult
from apps.results.serializers import StudentResultSerializer
from apps.schools.mixins import TenantIsolationMixin
from apps.authentication.permissions import IsActiveUser, IsSchoolAdmin, IsFaculty, IsParent, IsSchoolAdminOrFaculty
from apps.students.models import Student

class StudentResultViewSet(TenantIsolationMixin, viewsets.ModelViewSet):
    queryset = StudentResult.objects.all().order_by('-created_at')
    serializer_class = StudentResultSerializer
    permission_classes = [permissions.IsAuthenticated, IsActiveUser]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'bulk_submit']:
            # School admin and Faculty can write results
            return [permissions.IsAuthenticated(), IsActiveUser(), IsSchoolAdminOrFaculty()]
        return [permissions.IsAuthenticated(), IsActiveUser()]

    @decorators.action(detail=False, methods=['post'])
    def bulk_submit(self, request):
        """
        Bulk submit exam marks for multiple students.
        Format: { "exam_id": 1, "marks": [ {"student_id": 1, "marks_obtained": 85.5, "remarks": "Good job"}, ... ] }
        """
        school = request.user.school
        if not school:
            return Response({"detail": "User not associated with a school."}, status=status.HTTP_400_BAD_REQUEST)
            
        exam_id = request.data.get('exam_id')
        marks_data = request.data.get('marks')
        
        if not exam_id or not marks_data:
            return Response({"detail": "exam_id and marks list are required."}, status=status.HTTP_400_BAD_REQUEST)

        created_or_updated = 0
        for entry in marks_data:
            student_id = entry.get('student_id')
            marks_obtained = entry.get('marks_obtained')
            remarks = entry.get('remarks', '')
            
            if not student_id or marks_obtained is None:
                continue
                
            try:
                # Validate tenant isolation
                student = Student.objects.get(id=student_id, school=school)
            except Student.DoesNotExist:
                continue
                
            result_obj, created = StudentResult.objects.update_or_create(
                school=school,
                student=student,
                exam_id=exam_id,
                defaults={
                    'marks_obtained': marks_obtained,
                    'remarks': remarks
                }
            )
            created_or_updated += 1

        return Response({
            "success": True,
            "message": f"Successfully updated results for {created_or_updated} students."
        }, status=status.HTTP_200_OK)
