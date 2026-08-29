from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Version 1 API routes
    path('api/v1/auth/', include('apps.authentication.urls')),
    path('api/v1/schools/', include('apps.schools.urls')),
    path('api/v1/students/', include('apps.students.urls')),
    path('api/v1/faculty/', include('apps.faculty.urls')),
    path('api/v1/attendance/', include('apps.attendance.urls')),
    path('api/v1/exams/', include('apps.exams.urls')),
    path('api/v1/results/', include('apps.results.urls')),
    path('api/v1/fees/', include('apps.fees.urls')),
    path('api/v1/events/', include('apps.events.urls')),
    path('api/v1/transport/', include('apps.transport.urls')),
    path('api/v1/notifications/', include('apps.notifications.urls')),
    path('api/v1/analytics/', include('apps.analytics.urls')),
    path('api/v1/holidays/', include('apps.holidays.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
