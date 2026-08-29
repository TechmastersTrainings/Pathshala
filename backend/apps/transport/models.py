from django.db import models
from apps.schools.models import School

class TransportRoute(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='transport_routes')
    route_name = models.CharField(max_length=150)
    vehicle_number = models.CharField(max_length=50)
    driver_name = models.CharField(max_length=100)
    driver_phone = models.CharField(max_length=20)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.route_name} - {self.vehicle_number} ({self.school.name})"
