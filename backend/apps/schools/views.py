from rest_framework import viewsets, permissions, status, decorators
from rest_framework.response import Response
from apps.schools.models import School, Plan, Subscription
from apps.schools.serializers import SchoolSerializer, PlanSerializer, SubscriptionSerializer
from apps.authentication.permissions import IsSuperAdmin
from apps.authentication.models import ActivityLog

class PlanViewSet(viewsets.ModelViewSet):
    queryset = Plan.objects.all().order_by('price')
    serializer_class = PlanSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), IsSuperAdmin()]


class SchoolViewSet(viewsets.ModelViewSet):
    queryset = School.objects.all().order_by('-created_at')
    serializer_class = SchoolSerializer
    permission_classes = [permissions.IsAuthenticated, IsSuperAdmin]

    @decorators.action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        school = self.get_object()
        school.status = 'ACTIVE'
        school.save()
        
        # Activate all school admins for this school
        school.users.filter(role='SCHOOL_ADMIN').update(is_active=True)

        # Log action
        ActivityLog.objects.create(
            user=request.user,
            school=school,
            action=f"Approved and activated school: {school.name}"
        )
        
        return Response({
            "success": True,
            "message": f"School {school.name} is now ACTIVE.",
            "status": school.status
        })

    @decorators.action(detail=True, methods=['post'])
    def suspend(self, request, pk=None):
        school = self.get_object()
        school.status = 'SUSPENDED'
        school.save()
        
        # Suspend all users for this school
        school.users.update(is_active=False)

        ActivityLog.objects.create(
            user=request.user,
            school=school,
            action=f"Suspended school: {school.name}"
        )
        
        return Response({
            "success": True,
            "message": f"School {school.name} has been SUSPENDED.",
            "status": school.status
        })

    @decorators.action(detail=True, methods=['post'])
    def deactivate(self, request, pk=None):
        school = self.get_object()
        school.status = 'INACTIVE'
        school.save()
        
        # Deactivate all users for this school
        school.users.update(is_active=False)

        ActivityLog.objects.create(
            user=request.user,
            school=school,
            action=f"Deactivated school: {school.name}"
        )
        
        return Response({
            "success": True,
            "message": f"School {school.name} has been deactivated.",
            "status": school.status
        })


class SubscriptionViewSet(viewsets.ModelViewSet):
    queryset = Subscription.objects.all().order_by('-created_at')
    serializer_class = SubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated, IsSuperAdmin]
