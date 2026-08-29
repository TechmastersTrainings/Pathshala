from rest_framework import viewsets, permissions
from apps.events.models import Event
from apps.events.serializers import EventSerializer
from apps.schools.mixins import TenantIsolationMixin
from apps.authentication.permissions import IsActiveUser, IsSchoolAdmin

class EventViewSet(TenantIsolationMixin, viewsets.ModelViewSet):
    queryset = Event.objects.all().order_by('start_date')
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated, IsActiveUser]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsActiveUser(), IsSchoolAdmin()]
        return [permissions.IsAuthenticated(), IsActiveUser()]
