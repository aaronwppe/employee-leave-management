from django.db import models
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
