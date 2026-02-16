from django.db import models, transaction
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError
from django.utils import timezone
from datetime import timedelta
from account.models import Account
from org_calendar.models import Holiday
from org_calendar.models import WeekOff


class Leave(models.Model):
    account = models.ForeignKey(
        Account, on_delete=models.CASCADE, related_name="leaves"
    )
    reason = models.TextField()

    start_date = models.DateField()
    end_date = models.DateField()
    number_of_leaves = models.PositiveIntegerField(validators=[MinValueValidator(1)])

    created_on = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(
        to=Account,
        related_name="leaves_created",
        on_delete=models.PROTECT,
    )

    modified_on = models.DateTimeField(auto_now=True)
    modified_by = models.ForeignKey(
        to=Account,
        related_name="leaves_modified",
        on_delete=models.PROTECT,
    )

    is_deleted = models.BooleanField(default=False)
    deleted_on = models.DateTimeField(null=True)
    deleted_by = models.ForeignKey(
        to=Account,
        related_name="leaves_deleted",
        on_delete=models.PROTECT,
        null=True,
    )

    def soft_delete(self, account: Account):
        if self.is_deleted is True:
            raise ValidationError("Leave is already deleted.")

        self.is_deleted = True
        self.deleted_on = timezone.now()
        self.deleted_by = account
        self.save(update_fields=["is_deleted", "deleted_on", "deleted_by"])

    # ----------------------------------------------------
    # WORKING DAY CALCULATION (NEW LOGIC)
    # ----------------------------------------------------
    @staticmethod
    def calculate_working_days(start_date, end_date):
        total_days = 0
        current = start_date

        # Get holidays in range
        holidays = set(
            Holiday.objects.filter(
                date_of_holiday__range=[start_date, end_date],
                is_deleted=False,
            ).values_list("date_of_holiday", flat=True)
        )

        # Get weekoff rules
        weekoffs = WeekOff.objects.all()

        day_map = {
            "MONDAY": 0,
            "TUESDAY": 1,
            "WEDNESDAY": 2,
            "THURSDAY": 3,
            "FRIDAY": 4,
            "SATURDAY": 5,
            "SUNDAY": 6,
        }

        while current <= end_date:
            is_holiday = current in holidays
            is_weekoff = False

            for weekoff in weekoffs:
                if current.weekday() == day_map[weekoff.day]:
                    week_number = (current.day - 1) // 7 + 1

                    if weekoff.weeks == "ALL" or week_number in weekoff.weeks:
                        is_weekoff = True
                        break

            if not is_holiday and not is_weekoff:
                total_days += 1

            current += timedelta(days=1)

        return total_days

    # ----------------------------------------------------
    # LEAVE CREATION
    # ----------------------------------------------------
    @classmethod
    @transaction.atomic
    def create_leave(cls, account: Account, start_date, end_date, reason, created_by):

        # Overlapping leave validation
        overlapping = cls.objects.filter(
            account=account,
            is_deleted=False,
            start_date__lte=end_date,
            end_date__gte=start_date,
        ).exists()

        if overlapping:
            raise ValidationError("Overlapping leave already exists.")

        # Calculate working days (skip weekends + holidays)
        number_of_leaves = cls.calculate_working_days(start_date, end_date)

        if number_of_leaves <= 0:
            raise ValidationError(
                "Selected dates contain only holidays or week offs."
            )

        # Leave balance validation
        if account.remaining_leaves < number_of_leaves:
            raise ValidationError("Cannot apply for this leave. Insufficient leaves.")

        leave = cls.objects.create(
            account=account,
            start_date=start_date,
            end_date=end_date,
            number_of_leaves=number_of_leaves,
            reason=reason,
            created_by=created_by,
            modified_by=created_by,
        )

        account.remaining_leaves -= number_of_leaves
        account.save(update_fields=["remaining_leaves"])

        return leave
