from rest_framework import serializers
from apps.faculty.models import FacultyProfile, FacultySubjectAssignment
from django.contrib.auth import get_user_model

User = get_user_model()

class FacultyProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)

    class Meta:
        model = FacultyProfile
        fields = '__all__'
        read_only_fields = ('id', 'school', 'user', 'created_at', 'updated_at')


class FacultySubjectAssignmentSerializer(serializers.ModelSerializer):
    faculty_name = serializers.CharField(source='faculty.user.get_full_name', read_only=True)
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    class_name = serializers.CharField(source='class_obj.name', read_only=True)
    class_section = serializers.CharField(source='class_obj.section', read_only=True)

    class Meta:
        model = FacultySubjectAssignment
        fields = '__all__'
        read_only_fields = ('id', 'school', 'created_at', 'updated_at')
