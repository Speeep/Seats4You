from django.db import models

# Create your models here.

class Section(models.Model):
    rows = models.IntegerField()
    columns = models.IntegerField()

    def __str__(self):
        return f'{self.rows}x{self.columns}'
    

class Venue(models.Model):
    name = models.CharField(max_length=100)
    sideLeft = models.OneToOneField(Section, on_delete=models.CASCADE, related_name='sideLeft')
    center = models.OneToOneField(Section, on_delete=models.CASCADE, related_name='center')
    sideRight = models.OneToOneField(Section, on_delete=models.CASCADE, related_name='sideRight')

    def __str__(self):
        return self.name
    
class Seat(models.Model):
    price = models.FloatField()
    section = models.ForeignKey(Section, on_delete=models.CASCADE)
    row = models.CharField(max_length=3)
    column = models.IntegerField()
    available = models.BooleanField()
    def __str__(self):
        return f'{self.section} - {self.row}x{self.column}'

class Block(models.Model):
    section = models.ForeignKey(Section, on_delete=models.CASCADE)
    rows = models.CharField(max_length=3)
    price = models.FloatField()
    seats = models.ForeignKey(Seat, on_delete=models.CASCADE)
    def __str__(self):
        return f'{self.section}'
    
class Show(models.Model):
    name = models.CharField(max_length=100)
    venue = models.ForeignKey(Venue, on_delete=models.CASCADE)
    earnings = models.FloatField()
    active = models.BooleanField()
    blocks = models.ForeignKey(Block, on_delete=models.CASCADE)
    date = models.DateField()
    time = models.TimeField()

    def __str__(self):
        return self.name