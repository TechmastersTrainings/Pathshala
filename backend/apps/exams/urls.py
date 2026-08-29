from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.exams.views import ExamViewSet

router = DefaultRouter()
router.register(r'records', ExamViewSet, basename='exam')

urlpatterns = [
    path('', include(router.urls)),
]
