from rest_framework import viewsets, permissions, status, decorators
from rest_framework.response import Response
from django.db import transaction
from django.contrib.auth import get_user_model
from apps.faculty.models import FacultyProfile, FacultySubjectAssignment
from apps.faculty.serializers import FacultyProfileSerializer, FacultySubjectAssignmentSerializer
from apps.schools.mixins import TenantIsolationMixin
from apps.schools.models import School
from apps.authentication.permissions import IsActiveUser, IsSchoolAdmin, IsFaculty
from apps.authentication.models import ActivityLog

User = get_user_model()

class FacultyProfileViewSet(TenantIsolationMixin, viewsets.ModelViewSet):
    queryset = FacultyProfile.objects.all()
    serializer_class = FacultyProfileSerializer
    permission_classes = [permissions.IsAuthenticated, IsActiveUser]

    def get_permissions(self):
        if self.action == 'register':
            return [permissions.AllowAny()]
        if self.action in ['create', 'approve', 'reject', 'toggle_status', 'destroy']:
            return [permissions.IsAuthenticated(), IsActiveUser(), IsSchoolAdmin()]
        return [permissions.IsAuthenticated(), IsActiveUser()]

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        school = request.user.school
        if not school:
            return Response({"detail": "User not associated with a school."}, status=status.HTTP_400_BAD_REQUEST)

        username = request.data.get('username') or request.data.get('email')
        email = request.data.get('email')
        password = request.data.get('password', 'welcome123') # Default password if not provided
        first_name = request.data.get('first_name', '')
        last_name = request.data.get('last_name', '')
        phone = request.data.get('phone', '')
        employee_id = request.data.get('employee_id')
        qualification = request.data.get('qualification', 'Not Specified')
        experience_years = request.data.get('experience_years', 0)

        if not email or not employee_id:
            return Response({"detail": "email and employee_id are required."},
                            status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists() or User.objects.filter(email=email).exists():
            return Response({"detail": "A user with this email already exists."}, status=status.HTTP_400_BAD_REQUEST)

        # 1. Create User (is_active=True)
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            phone=phone,
            role='FACULTY',
            school=school,
            is_active=True
        )

        # 2. Create Faculty Profile
        profile = FacultyProfile.objects.create(
            user=user,
            school=school,
            employee_id=employee_id,
            qualification=qualification,
            experience_years=experience_years,
            status='ACTIVE'
        )

        # Log Activity
        ActivityLog.objects.create(
            user=request.user,
            school=school,
            action=f"Faculty user created directly by admin: {username}"
        )

        serializer = self.get_serializer(profile)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @decorators.action(detail=False, methods=['post'])
    @transaction.atomic
    def register(self, request):
        """
        Public registration flow for Faculty.
        Creates User with status PENDING (is_active=False).
        """
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        first_name = request.data.get('first_name', '')
        last_name = request.data.get('last_name', '')
        phone = request.data.get('phone', '')
        school_id = request.data.get('school_id')
        
        employee_id = request.data.get('employee_id')
        qualification = request.data.get('qualification')
        experience_years = request.data.get('experience_years', 0)

        if not username or not email or not password or not school_id or not employee_id or not qualification:
            return Response({"detail": "username, email, password, school_id, employee_id, and qualification are required."},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            school = School.objects.get(id=school_id)
        except School.DoesNotExist:
            return Response({"detail": "Selected school does not exist."}, status=status.HTTP_404_NOT_FOUND)

        if User.objects.filter(username=username).exists() or User.objects.filter(email=email).exists():
            return Response({"detail": "A user with this username or email already exists."}, status=status.HTTP_400_BAD_REQUEST)

        # 1. Create User (is_active=False initially since status is PENDING)
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            phone=phone,
            role='FACULTY',
            school=school,
            is_active=False
        )

        # 2. Create Faculty Profile
        profile = FacultyProfile.objects.create(
            user=user,
            school=school,
            employee_id=employee_id,
            qualification=qualification,
            experience_years=experience_years,
            status='PENDING'
        )

        # Log Activity
        ActivityLog.objects.create(
            user=None,
            school=school,
            action=f"Faculty user registered: {username} (Pending approval)"
        )

        serializer = self.get_serializer(profile)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @decorators.action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        profile = self.get_object()
        if profile.status != 'PENDING':
            return Response({"detail": "Faculty is not in PENDING state."}, status=status.HTTP_400_BAD_REQUEST)

        profile.status = 'ACTIVE'
        profile.user.is_active = True
        profile.user.save()
        profile.save()

        ActivityLog.objects.create(
            user=request.user,
            school=request.user.school,
            action=f"Approved faculty profile: {profile.user.username}"
        )

        return Response({"success": True, "status": profile.status})

    @decorators.action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        profile = self.get_object()
        if profile.status != 'PENDING':
            return Response({"detail": "Faculty is not in PENDING state."}, status=status.HTTP_400_BAD_REQUEST)

        profile.status = 'REJECTED'
        profile.user.is_active = False
        profile.user.save()
        profile.save()

        ActivityLog.objects.create(
            user=request.user,
            school=request.user.school,
            action=f"Rejected faculty profile: {profile.user.username}"
        )

        return Response({"success": True, "status": profile.status})

    @decorators.action(detail=True, methods=['post'])
    def toggle_status(self, request, pk=None):
        profile = self.get_object()
        profile.status = 'INACTIVE' if profile.status == 'ACTIVE' else 'ACTIVE'
        profile.user.is_active = (profile.status == 'ACTIVE')
        profile.user.save()
        profile.save()

        ActivityLog.objects.create(
            user=request.user,
            school=request.user.school,
            action=f"Toggled faculty status: {profile.user.username} to {profile.status}"
        )

        return Response({"success": True, "status": profile.status})


class FacultySubjectAssignmentViewSet(TenantIsolationMixin, viewsets.ModelViewSet):
    queryset = FacultySubjectAssignment.objects.all()
    serializer_class = FacultySubjectAssignmentSerializer
    permission_classes = [permissions.IsAuthenticated, IsActiveUser]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsActiveUser(), IsSchoolAdmin()]
        return [permissions.IsAuthenticated(), IsActiveUser()]

    @decorators.action(detail=False, methods=['get'])
    def my_assignments(self, request):
        """
        Retrieves the assignments for the logged-in Faculty member.
        """
        if request.user.role != 'FACULTY':
            return Response({"detail": "Only faculty members can access their assignments."}, status=status.HTTP_403_FORBIDDEN)
            
        try:
            profile = request.user.faculty_profile
        except FacultyProfile.DoesNotExist:
            return Response({"detail": "Faculty profile not found."}, status=status.HTTP_404_NOT_FOUND)
            
        assignments = self.queryset.filter(faculty=profile)
        serializer = self.get_serializer(assignments, many=True)
        return Response(serializer.data)
