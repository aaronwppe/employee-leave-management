from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from account.models import Account, AccountRole


class WeekOff(models.Model):
    week_of_month = models.PositiveIntegerField(
        primary_key=True,
        validators=[MinValueValidator(1), MaxValueValidator(5)],
    )

    sunday = models.BooleanField(default=False)
    monday = models.BooleanField(default=False)
    tuesday = models.BooleanField(default=False)
    wednesday = models.BooleanField(default=False)
    thursday = models.BooleanField(default=False)
    friday = models.BooleanField(default=False)
    saturday = models.BooleanField(default=False)

    modified_on = models.DateTimeField(auto_now=True)
    modified_by = models.ForeignKey(
        Account,
        on_delete=models.PROTECT,
        related_name="weekoffs_modified",
        limit_choices_to={"role": AccountRole.ADMIN},
    )
