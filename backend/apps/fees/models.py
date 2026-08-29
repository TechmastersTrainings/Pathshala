from django.db import models
from apps.schools.models import School
from apps.students.models import Student

class StudentFee(models.Model):
    STATUS_CHOICES = (
        ('PAID', 'Paid'),
        ('PARTIAL', 'Partial'),
        ('UNPAID', 'Unpaid'),
    )

    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='fees')
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='fees')
    amount_due = models.DecimalField(max_digits=10, decimal_places=2)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    due_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='UNPAID')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.student.name} - Due: {self.amount_due} (Status: {self.status})"
