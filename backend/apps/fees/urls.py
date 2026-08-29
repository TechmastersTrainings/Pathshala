from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.fees.views import StudentFeeViewSet

router = DefaultRouter()
router.register(r'records', StudentFeeViewSet, basename='fee')

urlpatterns = [
    path('', include(router.urls)),
]
