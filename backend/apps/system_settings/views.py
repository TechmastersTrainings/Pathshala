from rest_framework import viewsets, permissions
from apps.system_settings.models import Timetable
from apps.system_settings.serializers import TimetableSerializer
from apps.schools.mixins import TenantIsolationMixin
from apps.authentication.permissions import IsActiveUser, IsSchoolAdmin

class TimetableViewSet(TenantIsolationMixin, viewsets.ModelViewSet):
    queryset = Timetable.objects.all().order_by('day_of_week', 'start_time')
    serializer_class = TimetableSerializer
    permission_classes = [permissions.IsAuthenticated, IsActiveUser]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsActiveUser(), IsSchoolAdmin()]
        return [permissions.IsAuthenticated(), IsActiveUser()]
