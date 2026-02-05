from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
class WeekendOff(models.Model):
    week_of_month = models.PositiveIntegerField(
        primary_key=True,
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        
    )
    days = models.BinaryField()