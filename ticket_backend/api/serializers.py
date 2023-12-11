from rest_framework import serializers
from .models import *

class SectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = '__all__'

class VenueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venue
        fields = '__all__'
    
class SeatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seat
        fields = '__all__'

class BlockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Block
        fields = '__all__'

class ShowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Show
        fields = '__all__'