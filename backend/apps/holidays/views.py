from rest_framework import viewsets, permissions
from apps.holidays.models import Holiday, Roster
from apps.holidays.serializers import HolidaySerializer, RosterSerializer
from apps.schools.mixins import TenantIsolationMixin
from apps.authentication.permissions import IsActiveUser, IsSchoolAdmin

class HolidayViewSet(TenantIsolationMixin, viewsets.ModelViewSet):
    queryset = Holiday.objects.all().order_by('-start_date')
    serializer_class = HolidaySerializer
    permission_classes = [permissions.IsAuthenticated, IsActiveUser]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsActiveUser(), IsSchoolAdmin()]
        return [permissions.IsAuthenticated(), IsActiveUser()]

    def perform_create(self, serializer):
        serializer.save(school=self.request.user.school)


class RosterViewSet(TenantIsolationMixin, viewsets.ModelViewSet):
    queryset = Roster.objects.all().order_by('-start_date')
    serializer_class = RosterSerializer
    permission_classes = [permissions.IsAuthenticated, IsActiveUser]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsActiveUser(), IsSchoolAdmin()]
        return [permissions.IsAuthenticated(), IsActiveUser()]

    def perform_create(self, serializer):
        serializer.save(school=self.request.user.school)
