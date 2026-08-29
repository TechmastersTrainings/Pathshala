from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.transport.views import TransportRouteViewSet

router = DefaultRouter()
router.register(r'routes', TransportRouteViewSet, basename='transport-route')

urlpatterns = [
    path('', include(router.urls)),
]
