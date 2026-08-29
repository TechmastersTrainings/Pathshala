from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.faculty.views import FacultyProfileViewSet, FacultySubjectAssignmentViewSet

router = DefaultRouter()
router.register(r'profiles', FacultyProfileViewSet, basename='faculty-profile')
router.register(r'assignments', FacultySubjectAssignmentViewSet, basename='faculty-assignment')

urlpatterns = [
    path('', include(router.urls)),
]
