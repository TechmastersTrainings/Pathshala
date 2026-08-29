# apps/events/serializers.py
from rest_framework import serializers
from apps.events.models import Event

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'
        read_only_fields = ('id', 'school', 'created_at', 'updated_at')
