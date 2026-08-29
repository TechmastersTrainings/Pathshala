from rest_framework import serializers
from apps.fees.models import StudentFee

class StudentFeeSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.name', read_only=True)
    roll_number = serializers.CharField(source='student.roll_number', read_only=True)
    class_name = serializers.CharField(source='student.class_obj.name', read_only=True)
    class_section = serializers.CharField(source='student.class_obj.section', read_only=True)

    class Meta:
        model = StudentFee
        fields = '__all__'
        read_only_fields = ('id', 'school', 'created_at', 'updated_at')
