from django.db import models, transaction
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError
from django.utils import timezone
from account.models import Account


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
        if self.is_deleted == True:
            raise ValidationError("Leave is already deleted.")

        self.is_deleted = True
        self.deleted_on = timezone.now()
        self.deleted_by = account
        self.save(update_fields=["is_deleted", "deleted_on", "deleted_by"])

    @classmethod
    @transaction.atomic
    def create_leave(cls, account: Account, start_date, end_date, reason, created_by):
        number_of_leaves = (end_date - start_date).days + 1

        if number_of_leaves <= 0:
            raise ValidationError("Start date cannot be after end date.")

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
