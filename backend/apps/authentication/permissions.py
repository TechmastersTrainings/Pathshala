from rest_framework import permissions
from django.utils import timezone
from apps.schools.models import Subscription

class IsActiveUser(permissions.BasePermission):
    """
    Allows access only to active users who are not soft-deleted.
    """
    def has_permission(self, request, view):
        user = request.user
        return bool(user and user.is_authenticated and user.is_active and not user.is_deleted)


class IsTenantActive(permissions.BasePermission):
    """
    Enforces school and subscription validation for school-related roles.
    """
    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False
            
        # Super admin doesn't belong to a specific school
        if user.role == 'SUPER_ADMIN':
            return True
            
        school = user.school
        if not school or school.is_deleted:
            return False
            
        if school.status != 'ACTIVE':
            return False
            
        # Check active subscription
        active_sub = Subscription.objects.filter(
            school=school,
            status='ACTIVE',
            end_date__gte=timezone.now()
        ).exists()
        
        return active_sub


class HasRole(permissions.BasePermission):
    """
    Base class for role-based access control.
    """
    def __init__(self, allowed_roles):
        self.allowed_roles = allowed_roles

    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        return user.role in self.allowed_roles


class IsSuperAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'SUPER_ADMIN')


class IsSchoolAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.role == 'SCHOOL_ADMIN' and
            request.user.school and
            request.user.school.status == 'ACTIVE'
        )


class IsFaculty(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.role == 'FACULTY' and
            request.user.school and
            request.user.school.status == 'ACTIVE'
        )

class IsSchoolAdminOrFaculty(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.role in ['SCHOOL_ADMIN', 'FACULTY'] and
            request.user.school and
            request.user.school.status == 'ACTIVE'
        )


class IsParent(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.role == 'PARENT' and
            request.user.school and
            request.user.school.status == 'ACTIVE'
        )
