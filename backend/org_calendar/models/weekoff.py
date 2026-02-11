from django.db import models
from account.models import Account, AccountRole


class WeekOff(models.Model):
    DAY_CHOICES = [
        ("SUNDAY", "Sunday"),
        ("MONDAY", "Monday"),
        ("TUESDAY", "Tuesday"),
        ("WEDNESDAY", "Wednesday"),
        ("THURSDAY", "Thursday"),
        ("FRIDAY", "Friday"),
        ("SATURDAY", "Saturday"),
    ]

    day = models.CharField(max_length=10, choices=DAY_CHOICES, unique=True)

    # "ALL" or list of weeks [1–6]
    weeks = models.JSONField(default=list)

    created_on = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        Account,
        on_delete=models.PROTECT,
        related_name="weekoffs_created",
        limit_choices_to={"role": AccountRole.ADMIN},
    )

    def __str__(self):
        return f"{self.day} WeekOff"
