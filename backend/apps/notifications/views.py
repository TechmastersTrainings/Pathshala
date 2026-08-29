from rest_framework import viewsets, permissions, exceptions
from apps.notifications.models import Notification
from apps.notifications.serializers import NotificationSerializer
from django.db.models import Q
from apps.authentication.permissions import IsActiveUser, IsSchoolAdmin, IsSuperAdmin, IsSchoolAdminOrFaculty

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all().order_by('-created_at')
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated, IsActiveUser]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsActiveUser(), IsSchoolAdminOrFaculty()]
        return [permissions.IsAuthenticated(), IsActiveUser()]

    def get_queryset(self):
        user = self.request.user
        if not user or not user.is_authenticated:
            return Notification.objects.none()
            
        if user.role == 'SUPER_ADMIN':
            return self.queryset

        school = user.school
        if not school:
            raise exceptions.PermissionDenied("User is not associated with any school.")

        # Non-Super Admin roles can only view:
        # 1. School-specific notifications or Global notifications (school=None)
        # 2. Notifications targeted to 'ALL' or to their specific role
        return self.queryset.filter(
            Q(school=school) | Q(school__isnull=True)
        ).filter(
            Q(recipient_role='ALL') | Q(recipient_role=user.role)
        )

    def perform_create(self, serializer):
        user = self.request.user
        if user.role == 'SUPER_ADMIN':
            # Super Admin can create global notifications
            serializer.save()
        else:
            if not user.school:
                raise exceptions.PermissionDenied("User is not associated with any school.")
            serializer.save(school=user.school)
