from django.db import models
from django.conf import settings
from apps.schools.models import School
from apps.students.models import Class, Subject

class FacultyProfile(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('ACTIVE', 'Active'),
        ('INACTIVE', 'Inactive'),
        ('REJECTED', 'Rejected'),
    )

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='faculty_profile')
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='faculty_profiles')
    employee_id = models.CharField(max_length=50)
    qualification = models.CharField(max_length=255)
    experience_years = models.IntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('school', 'employee_id')

    def __str__(self):
        return f"Faculty: {self.user.get_full_name() or self.user.username}"


class FacultySubjectAssignment(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='faculty_assignments')
    faculty = models.ForeignKey(FacultyProfile, on_delete=models.CASCADE, related_name='assignments')
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='faculty_assignments')
    class_obj = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='faculty_assignments')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('school', 'faculty', 'subject', 'class_obj')

    def __str__(self):
        return f"{self.faculty.user.username} - {self.subject.name} in {self.class_obj}"
