from rest_framework import serializers
from apps.exams.models import Exam

class ExamSerializer(serializers.ModelSerializer):
    class_name = serializers.CharField(source='class_obj.name', read_only=True)
    class_section = serializers.CharField(source='class_obj.section', read_only=True)
    subject_name = serializers.CharField(source='subject.name', read_only=True)

    class Meta:
        model = Exam
        fields = '__all__'
        read_only_fields = ('id', 'school', 'created_at', 'updated_at')
