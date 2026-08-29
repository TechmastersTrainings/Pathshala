from django.contrib import admin
from .models import FacultyProfile, FacultySubjectAssignment

@admin.register(FacultyProfile)
class FacultyProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'employee_id', 'school', 'qualification', 'status')
    list_filter = ('school', 'status')

@admin.register(FacultySubjectAssignment)
class FacultySubjectAssignmentAdmin(admin.ModelAdmin):
    list_display = ('faculty', 'class_obj', 'subject', 'school')
    list_filter = ('school',)
