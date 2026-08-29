from rest_framework import viewsets, permissions, status, decorators
from rest_framework.response import Response
from apps.attendance.models import StudentAttendance
from apps.attendance.serializers import StudentAttendanceSerializer
from apps.schools.mixins import TenantIsolationMixin
from apps.authentication.permissions import IsActiveUser, IsSchoolAdmin, IsFaculty, IsSchoolAdminOrFaculty
from apps.students.models import Student

class StudentAttendanceViewSet(TenantIsolationMixin, viewsets.ModelViewSet):
    queryset = StudentAttendance.objects.all().order_by('-date')
    serializer_class = StudentAttendanceSerializer
    permission_classes = [permissions.IsAuthenticated, IsActiveUser]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'bulk_mark']:
            # Admins and Faculty can write
            return [permissions.IsAuthenticated(), IsActiveUser(), IsSchoolAdminOrFaculty()]
        return [permissions.IsAuthenticated(), IsActiveUser()]

    def perform_create(self, serializer):
        serializer.save(school=self.request.user.school, marked_by=self.request.user)

    @decorators.action(detail=False, methods=['post'])
    def bulk_mark(self, request):
        """
        Batch post attendance for multiple students for a specific date.
        Format: { "date": "YYYY-MM-DD", "records": [ {"student_id": 1, "status": "PRESENT"}, ... ] }
        """
        school = request.user.school
        if not school:
            return Response({"detail": "User not associated with a school."}, status=status.HTTP_400_BAD_REQUEST)
            
        date = request.data.get('date')
        records = request.data.get('records')
        
        if not date or not records:
            return Response({"detail": "date and records fields are required."}, status=status.HTTP_400_BAD_REQUEST)

        created_or_updated = 0
        for record in records:
            student_id = record.get('student_id')
            status_val = record.get('status')
            
            if not student_id or not status_val:
                continue
                
            try:
                # Ensure student belongs to the same school (tenant isolation check)
                student = Student.objects.get(id=student_id, school=school)
            except Student.DoesNotExist:
                continue
                
            # Create or update attendance
            attendance_obj, created = StudentAttendance.objects.update_or_create(
                school=school,
                student=student,
                date=date,
                defaults={
                    'status': status_val,
                    'marked_by': request.user
                }
            )
            created_or_updated += 1

        return Response({
            "success": True,
            "message": f"Successfully updated attendance for {created_or_updated} students."
        }, status=status.HTTP_200_OK)
