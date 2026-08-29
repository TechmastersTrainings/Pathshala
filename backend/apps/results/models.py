from django.db import models
from apps.schools.models import School
from apps.students.models import Student
from apps.exams.models import Exam

class StudentResult(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='results')
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='results')
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name='results')
    marks_obtained = models.DecimalField(max_digits=5, decimal_places=2)
    remarks = models.TextField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('school', 'student', 'exam')

    def __str__(self):
        return f"{self.student.name} - {self.exam.name}: {self.marks_obtained}"
