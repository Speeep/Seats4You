from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from .serializers import *

# Create your views here.

class SectionViewSet(viewsets.ModelViewSet):
    queryset = Section.objects.all()
    serializer_class = SectionSerializer

class VenueViewSet(viewsets.ModelViewSet):
    queryset = Venue.objects.all()
    serializer_class = VenueSerializer

class SeatViewSet(viewsets.ModelViewSet):
    queryset = Seat.objects.all()
    serializer_class = SeatSerializer

class BlockViewSet(viewsets.ModelViewSet):
    queryset = Block.objects.all()
    serializer_class = BlockSerializer

class ShowViewSet(viewsets.ModelViewSet):
    queryset = Show.objects.all()
    serializer_class = ShowSerializer