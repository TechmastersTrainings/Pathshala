from rest_framework import viewsets, permissions
from apps.transport.models import TransportRoute
from apps.transport.serializers import TransportRouteSerializer
from apps.schools.mixins import TenantIsolationMixin
from apps.authentication.permissions import IsActiveUser, IsSchoolAdmin

class TransportRouteViewSet(TenantIsolationMixin, viewsets.ModelViewSet):
    queryset = TransportRoute.objects.all().order_by('route_name')
    serializer_class = TransportRouteSerializer
    permission_classes = [permissions.IsAuthenticated, IsActiveUser]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsActiveUser(), IsSchoolAdmin()]
        return [permissions.IsAuthenticated(), IsActiveUser()]
