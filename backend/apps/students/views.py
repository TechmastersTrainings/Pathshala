from rest_framework import viewsets, permissions, status, decorators
from rest_framework.response import Response
from django.db import transaction
from django.contrib.auth import get_user_model
from apps.students.models import Class, Subject, Student, ParentProfile, StudentParentMapping
from apps.students.serializers import (
    ClassSerializer, 
    SubjectSerializer, 
    StudentSerializer, 
    ParentProfileSerializer, 
    StudentParentMappingSerializer
)
from apps.schools.mixins import TenantIsolationMixin
from apps.authentication.permissions import IsActiveUser, IsSchoolAdmin, IsFaculty, IsParent, IsSchoolAdminOrFaculty
from apps.authentication.models import ActivityLog

User = get_user_model()

class ClassViewSet(TenantIsolationMixin, viewsets.ModelViewSet):
    queryset = Class.objects.all()
    serializer_class = ClassSerializer
    permission_classes = [permissions.IsAuthenticated, IsActiveUser]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsActiveUser(), IsSchoolAdminOrFaculty()]
        # Faculty and Parents can read classes
        return [permissions.IsAuthenticated(), IsActiveUser()]


class SubjectViewSet(TenantIsolationMixin, viewsets.ModelViewSet):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    permission_classes = [permissions.IsAuthenticated, IsActiveUser]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsActiveUser(), IsSchoolAdminOrFaculty()]
        return [permissions.IsAuthenticated(), IsActiveUser()]


class StudentViewSet(TenantIsolationMixin, viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [permissions.IsAuthenticated, IsActiveUser]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsActiveUser(), IsSchoolAdminOrFaculty()]
        return [permissions.IsAuthenticated(), IsActiveUser()]


class ParentProfileViewSet(TenantIsolationMixin, viewsets.ModelViewSet):
    queryset = ParentProfile.objects.all()
    serializer_class = ParentProfileSerializer
    permission_classes = [permissions.IsAuthenticated, IsActiveUser, IsSchoolAdmin]

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        school = request.user.school
        if not school:
            return Response({"detail": "User not associated with a school."}, status=status.HTTP_400_BAD_REQUEST)
            
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        first_name = request.data.get('first_name', '')
        last_name = request.data.get('last_name', '')
        phone = request.data.get('phone', '')
        
        if not username or not email or not password:
            return Response({"detail": "username, email, and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists() or User.objects.filter(email=email).exists():
            return Response({"detail": "A user with this username or email already exists."}, status=status.HTTP_400_BAD_REQUEST)

        # 1. Create User
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            phone=phone,
            role='PARENT',
            school=school
        )

        # 2. Create ParentProfile
        parent_profile = ParentProfile.objects.create(
            user=user,
            school=school,
            address=request.data.get('address', ''),
            occupation=request.data.get('occupation', ''),
            status='ACTIVE'
        )

        # Log Activity
        ActivityLog.objects.create(
            user=request.user,
            school=school,
            action=f"Registered parent user: {username}"
        )

        serializer = self.get_serializer(parent_profile)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @decorators.action(detail=True, methods=['post'])
    def toggle_status(self, request, pk=None):
        parent = self.get_object()
        parent.status = 'INACTIVE' if parent.status == 'ACTIVE' else 'ACTIVE'
        parent.user.is_active = (parent.status == 'ACTIVE')
        parent.user.save()
        parent.save()
        
        ActivityLog.objects.create(
            user=request.user,
            school=request.user.school,
            action=f"Toggled parent {parent.user.username} status to {parent.status}"
        )
        
        return Response({
            "success": True,
            "status": parent.status
        })


class StudentParentMappingViewSet(TenantIsolationMixin, viewsets.ModelViewSet):
    queryset = StudentParentMapping.objects.all()
    serializer_class = StudentParentMappingSerializer
    permission_classes = [permissions.IsAuthenticated, IsActiveUser, IsSchoolAdmin]
