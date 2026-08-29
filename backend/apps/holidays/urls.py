from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.holidays.views import HolidayViewSet, RosterViewSet

router = DefaultRouter()
router.register(r'records', HolidayViewSet, basename='holiday')
router.register(r'rosters', RosterViewSet, basename='roster')

urlpatterns = [
    path('', include(router.urls)),
]
