from rest_framework import serializers
from .models import Holiday, Roster

class HolidaySerializer(serializers.ModelSerializer):
    class Meta:
        model = Holiday
        fields = '__all__'
        read_only_fields = ('id', 'school', 'created_at', 'updated_at')

class RosterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Roster
        fields = '__all__'
        read_only_fields = ('id', 'school', 'created_at', 'updated_at')
