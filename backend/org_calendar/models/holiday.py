from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone
from account.models import Account, AccountRole


class Holiday(models.Model):
    name = models.CharField(max_length=50)
    date_of_holiday = models.DateField()

    created_on = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(
        Account,
        on_delete=models.PROTECT,
        related_name="holidays_created",
        limit_choices_to={"role": AccountRole.ADMIN},
    )

    modified_on = models.DateTimeField(auto_now=True)
    modified_by = models.ForeignKey(
        Account,
        on_delete=models.PROTECT,
        related_name="holidays_modified",
        limit_choices_to={"role": AccountRole.ADMIN},
    )

    is_deleted = models.BooleanField(default=False)
    deleted_on = models.DateTimeField(null=True)
    deleted_by = models.ForeignKey(
        Account,
        on_delete=models.PROTECT,
        related_name="holidays_deleted",
        null=True,
    )

    def soft_delete(self, account: Account):
        if self.is_deleted == True:
            raise ValidationError("Holiday is already deleted.")

        self.is_deleted = True
        self.deleted_on = timezone.now()
        self.deleted_by = account

        self.save(update_fields=["is_deleted", "deleted_on", "deleted_by"])
