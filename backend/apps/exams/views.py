from rest_framework import viewsets, permissions
from apps.exams.models import Exam
from apps.exams.serializers import ExamSerializer
from apps.schools.mixins import TenantIsolationMixin
from apps.authentication.permissions import IsActiveUser, IsSchoolAdmin, IsFaculty, IsSchoolAdminOrFaculty

class ExamViewSet(TenantIsolationMixin, viewsets.ModelViewSet):
    queryset = Exam.objects.all().order_by('-exam_date')
    serializer_class = ExamSerializer
    permission_classes = [permissions.IsAuthenticated, IsActiveUser]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            # Admins and Faculty can manage exams
            return [permissions.IsAuthenticated(), IsActiveUser(), IsSchoolAdminOrFaculty()]
        return [permissions.IsAuthenticated(), IsActiveUser()]
