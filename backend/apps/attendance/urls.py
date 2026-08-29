from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.attendance.views import StudentAttendanceViewSet

router = DefaultRouter()
router.register(r'records', StudentAttendanceViewSet, basename='attendance')

urlpatterns = [
    path('', include(router.urls)),
]
