# apps/transport/serializers.py
from rest_framework import serializers
from apps.transport.models import TransportRoute

class TransportRouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransportRoute
        fields = '__all__'
        read_only_fields = ('id', 'school', 'created_at', 'updated_at')
