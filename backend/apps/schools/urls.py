from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.schools.views import SchoolViewSet, PlanViewSet, SubscriptionViewSet

router = DefaultRouter()
router.register(r'plans', PlanViewSet, basename='plan')
router.register(r'schools', SchoolViewSet, basename='school')
router.register(r'subscriptions', SubscriptionViewSet, basename='subscription')

urlpatterns = [
    path('', include(router.urls)),
]
