from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.results.views import StudentResultViewSet

router = DefaultRouter()
router.register(r'records', StudentResultViewSet, basename='result')

urlpatterns = [
    path('', include(router.urls)),
]
