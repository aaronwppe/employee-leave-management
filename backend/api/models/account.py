from django.db import models
from django.core.validators import MaxValueValidator
class Account(models.Model):
    class RoleType(models.TextChoices):
        EMPLOYEE = 'EMP','Employee'
        ADMIN = 'ADMIN','Admin'

    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(max_length=254)
    status = models.BooleanField(default=False)
    allocated_leaves = models.PositiveIntegerField(validators=[MaxValueValidator(365)])
    
    role = models.CharField(
        max_length=5,
        choices=RoleType.choices,
        default=RoleType.EMPLOYEE
    )
   
    created_on = models.DateTimeField(auto_now_add=True)
    modified_on = models.DateTimeField(auto_now=True)

    created_by = models.ForeignKey(
        'self',
        related_name='created_accounts',
        limit_choices_to={'role': 'ADMIN'},
        on_delete = models.CASCADE
    )
   
    modified_by =models.ForeignKey(
        'self',
        related_name='modified_accounts',
        limit_choices_to={'role': 'ADMIN'} ,
        on_delete = models.CASCADE
    )