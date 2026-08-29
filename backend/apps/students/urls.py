from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.students.views import (
    ClassViewSet,
    SubjectViewSet,
    StudentViewSet,
    ParentProfileViewSet,
    StudentParentMappingViewSet
)

router = DefaultRouter()
router.register(r'classes', ClassViewSet, basename='class')
router.register(r'subjects', SubjectViewSet, basename='subject')
router.register(r'students', StudentViewSet, basename='student')
router.register(r'parents', ParentProfileViewSet, basename='parent')
router.register(r'mappings', StudentParentMappingViewSet, basename='student-parent-mapping')

urlpatterns = [
    path('', include(router.urls)),
]
