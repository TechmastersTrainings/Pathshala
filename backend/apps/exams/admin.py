from django.contrib import admin
from .models import Exam

@admin.register(Exam)
class ExamAdmin(admin.ModelAdmin):
    list_display = ('name', 'class_obj', 'subject', 'exam_date', 'school')
    list_filter = ('school', 'class_obj', 'exam_date')
