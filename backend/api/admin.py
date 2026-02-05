from django.contrib import admin
from .models.account import Account
from .models.leave import Leave
from .models.holiday import Holiday
from .models.weekendOff import WeekendOff
# Register your models here.
admin.site.register(Account)
admin.site.register(Leave)
admin.site.register(Holiday)
admin.site.register(WeekendOff)
