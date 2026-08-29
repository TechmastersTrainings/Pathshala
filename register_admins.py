import os

apps_admin_content = {
    'authentication': """from django.contrib import admin
from .models import User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'role', 'school', 'is_active', 'date_joined')
    list_filter = ('role', 'school', 'is_active')
    search_fields = ('email', 'first_name', 'last_name')
""",
    'schools': """from django.contrib import admin
from .models import School, Class, Subject

@admin.register(School)
class SchoolAdmin(admin.ModelAdmin):
    list_display = ('name', 'admin_email', 'contact_email', 'status', 'subscription_plan')
    list_filter = ('status', 'subscription_plan')

@admin.register(Class)
class ClassAdmin(admin.ModelAdmin):
    list_display = ('name', 'section', 'school')

@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'school')
""",
    'students': """from django.contrib import admin
from .models import Student, Parent

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('name', 'roll_number', 'class_obj', 'school', 'admission_date')
    list_filter = ('school', 'class_obj')

@admin.register(Parent)
class ParentAdmin(admin.ModelAdmin):
    list_display = ('father_name', 'mother_name', 'primary_contact')
""",
    'faculty': """from django.contrib import admin
from .models import FacultyProfile, FacultyAssignment

@admin.register(FacultyProfile)
class FacultyProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'employee_id', 'school', 'qualification')

@admin.register(FacultyAssignment)
class FacultyAssignmentAdmin(admin.ModelAdmin):
    list_display = ('faculty', 'class_obj', 'subject', 'school')
""",
    'attendance': """from django.contrib import admin
from .models import StudentAttendance

@admin.register(StudentAttendance)
class StudentAttendanceAdmin(admin.ModelAdmin):
    list_display = ('student', 'date', 'status', 'school')
    list_filter = ('date', 'status', 'school')
""",
    'exams': """from django.contrib import admin
from .models import Exam

@admin.register(Exam)
class ExamAdmin(admin.ModelAdmin):
    list_display = ('name', 'class_obj', 'subject_name', 'exam_date', 'school')
""",
    'results': """from django.contrib import admin
from .models import StudentResult

@admin.register(StudentResult)
class StudentResultAdmin(admin.ModelAdmin):
    list_display = ('student', 'exam', 'marks_obtained', 'school')
"""
}

def setup_admin():
    base_dir = '/Users/sachin/Desktop/PathshalaERP/backend/apps'
    for app, content in apps_admin_content.items():
        admin_path = os.path.join(base_dir, app, 'admin.py')
        if os.path.exists(admin_path):
            with open(admin_path, 'w') as f:
                f.write(content)
            print(f"Updated {admin_path}")

if __name__ == "__main__":
    setup_admin()
