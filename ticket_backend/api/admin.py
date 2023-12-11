from django.contrib import admin

# Register your models here.

from .models import *

admin.site.register(Section)
admin.site.register(Venue)
admin.site.register(Seat)
admin.site.register(Block)
admin.site.register(Show)