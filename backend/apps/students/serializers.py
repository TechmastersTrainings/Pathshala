from rest_framework import serializers
from apps.students.models import Class, Subject, Student, ParentProfile, StudentParentMapping
from django.contrib.auth import get_user_model

User = get_user_model()

class ClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = Class
        fields = '__all__'
        read_only_fields = ('id', 'school', 'created_at', 'updated_at')


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = '__all__'
        read_only_fields = ('id', 'school', 'created_at', 'updated_at')


class StudentSerializer(serializers.ModelSerializer):
    class_name = serializers.CharField(source='class_obj.name', read_only=True)
    class_section = serializers.CharField(source='class_obj.section', read_only=True)

    class Meta:
        model = Student
        fields = '__all__'
        read_only_fields = ('id', 'school', 'created_at', 'updated_at', 'is_deleted', 'deleted_at')


class ParentProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)

    class Meta:
        model = ParentProfile
        fields = '__all__'
        read_only_fields = ('id', 'school', 'user', 'created_at', 'updated_at')


class StudentParentMappingSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.name', read_only=True)
    parent_name = serializers.CharField(source='parent.user.username', read_only=True)

    class Meta:
        model = StudentParentMapping
        fields = '__all__'
        read_only_fields = ('id', 'school', 'created_at', 'updated_at')
