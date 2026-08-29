from django.db import models
from apps.schools.models import School
from apps.students.models import Class, Subject
from apps.faculty.models import FacultyProfile

class Timetable(models.Model):
    DAY_CHOICES = (
        ('MONDAY', 'Monday'),
        ('TUESDAY', 'Tuesday'),
        ('WEDNESDAY', 'Wednesday'),
        ('THURSDAY', 'Thursday'),
        ('FRIDAY', 'Friday'),
        ('SATURDAY', 'Saturday'),
        ('SUNDAY', 'Sunday'),
    )

    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='timetables')
    class_obj = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='timetables')
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='timetables')
    faculty = models.ForeignKey(FacultyProfile, on_delete=models.CASCADE, related_name='timetables')
    
    day_of_week = models.CharField(max_length=20, choices=DAY_CHOICES)
    start_time = models.TimeField()
    end_time = models.TimeField()
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.class_obj} - {self.subject.name} ({self.day_of_week} {self.start_time}-{self.end_time})"
