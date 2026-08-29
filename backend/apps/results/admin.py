from django.contrib import admin
from .models import StudentResult

@admin.register(StudentResult)
class StudentResultAdmin(admin.ModelAdmin):
    list_display = ('student', 'exam', 'marks_obtained', 'school')
