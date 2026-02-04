from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from .account import Account
class Leave(models.Model):
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    reason = models.TextField()
    number_of_leaves = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(365)])
    start_date = models.DateField()
    end_date = models.DateField()
    created_on = models.DateTimeField(auto_now_add=True)
    modified_on = models.DateTimeField(auto_now=True)
    is_deleted = models.BooleanField(default=False) 
    deleted_on =models.DateTimeField() 
    deleted_by = models.ForeignKey(Account, on_delete=models.CASCADE)