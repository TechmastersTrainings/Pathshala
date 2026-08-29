from django.db import models
from apps.schools.models import School

class Notification(models.Model):
    ROLE_CHOICES = (
        ('ALL', 'All'),
        ('SCHOOL_ADMIN', 'School Admin'),
        ('FACULTY', 'Faculty'),
        ('PARENT', 'Parent'),
    )

    school = models.ForeignKey(School, on_delete=models.CASCADE, null=True, blank=True, related_name='notifications')
    title = models.CharField(max_length=200)
    message = models.TextField()
    recipient_role = models.CharField(max_length=30, choices=ROLE_CHOICES, default='ALL')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        scope = self.school.name if self.school else "Global"
        return f"{self.title} ({scope} - {self.recipient_role})"
