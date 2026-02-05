from django.db import models
from django.core.validators import MaxValueValidator
class Account(models.Model):
    class RoleType(models.TextChoices):
        EMPLOYEE = 'EMP','Employee'
        ADMIN = 'ADMIN','Admin'

    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(max_length=254)
    is_active = models.BooleanField(default=False)
    remaining_leaves = models.PositiveIntegerField(default=0,validators=[MaxValueValidator(365)])
    allocated_leaves = models.PositiveIntegerField(validators=[MaxValueValidator(365)])
    
    role = models.CharField(
        max_length=5,
        choices=RoleType.choices,
        default=RoleType.EMPLOYEE
    )
   
    created_on = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(
        'self',
        related_name='account_created',
        limit_choices_to={'role': 'ADMIN'},
        null=True,
        on_delete = models.SET_NULL
    )
   
    modified_on = models.DateTimeField(auto_now=True)
    modified_by =models.ForeignKey(
        'self',
        related_name='account_modified',
        limit_choices_to={'role': 'ADMIN'} ,
        null=True,
        on_delete = models.SET_NULL
    )