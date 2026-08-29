from rest_framework import serializers
from apps.attendance.models import StudentAttendance

class StudentAttendanceSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.name', read_only=True)
    roll_number = serializers.CharField(source='student.roll_number', read_only=True)
    class_name = serializers.CharField(source='student.class_obj.name', read_only=True)
    class_section = serializers.CharField(source='student.class_obj.section', read_only=True)
    marked_by_username = serializers.CharField(source='marked_by.username', read_only=True)

    class Meta:
        model = StudentAttendance
        fields = '__all__'
        read_only_fields = ('id', 'school', 'marked_by', 'created_at', 'updated_at')
