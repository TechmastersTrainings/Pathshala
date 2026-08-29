from rest_framework import serializers
from apps.results.models import StudentResult

class StudentResultSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.name', read_only=True)
    roll_number = serializers.CharField(source='student.roll_number', read_only=True)
    class_name = serializers.CharField(source='student.class_obj.name', read_only=True)
    class_section = serializers.CharField(source='student.class_obj.section', read_only=True)
    exam_name = serializers.CharField(source='exam.name', read_only=True)
    max_marks = serializers.DecimalField(source='exam.max_marks', max_digits=5, decimal_places=2, read_only=True)
    subject_name = serializers.CharField(source='exam.subject.name', read_only=True)

    class Meta:
        model = StudentResult
        fields = '__all__'
        read_only_fields = ('id', 'school', 'created_at', 'updated_at')
