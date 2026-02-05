from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from .account import Account
class Holiday(models.Model):
    name = models.CharField(max_length=256)
    date_of_holiday = models.DateField()
    created_on = models.DateTimeField()
    created_by = models.ForeignKey(Account,on_delete=models.CASCADE,related_name="holiday_created")
    modified_on = models.DateTimeField()
    modified_by = models.ForeignKey(Account, on_delete=models.CASCADE,related_name="holiday_modified")
    is_deleted = models.BooleanField(default=False)
    deleted_on = models.DateTimeField() 
    deleted_by = models.ForeignKey(Account, on_delete=models.CASCADE,related_name="holiday_deleted")
