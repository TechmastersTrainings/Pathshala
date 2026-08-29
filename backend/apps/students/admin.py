from django.contrib import admin
from .models import Class, Subject, Student, ParentProfile, StudentParentMapping

@admin.register(Class)
class ClassAdmin(admin.ModelAdmin):
    list_display = ('name', 'section', 'school')
    list_filter = ('school',)

@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'school')
    list_filter = ('school',)

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('name', 'roll_number', 'admission_number', 'class_obj', 'school')
    list_filter = ('school', 'class_obj')
    search_fields = ('name', 'roll_number', 'admission_number')

@admin.register(ParentProfile)
class ParentProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'school', 'occupation', 'status')
    list_filter = ('school', 'status')

@admin.register(StudentParentMapping)
class StudentParentMappingAdmin(admin.ModelAdmin):
    list_display = ('student', 'parent', 'school')
    list_filter = ('school',)
