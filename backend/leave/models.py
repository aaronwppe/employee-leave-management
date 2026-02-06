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
    modified_on = models.DateTimeField(auto_now=True)

    is_deleted = models.BooleanField(default=False)
    deleted_on = models.DateTimeField(null=True)

    def delete(self, *args, **kwargs):
        if self.is_deleted == True:
            raise ValidationError("Leave is already deleted.")

        self.is_deleted = True
        self.deleted_on = timezone.now()
        self.save(update_fields=["is_deleted", "deleted_on"])
