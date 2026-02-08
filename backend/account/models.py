from django.db import models
from django.core.validators import MaxValueValidator
from django.contrib.auth import models as auth_models


class AccountRole(models.TextChoices):
    EMPLOYEE = "EMPLOYEE", "Employee"
    ADMIN = "ADMIN", "Admin"


class AccountManager(auth_models.BaseUserManager):
    def create_user(
        self,
        first_name: str,
        last_name: str,
        email: str,
        role: AccountRole,
        default_allocated_leaves: int,
        remaining_leaves: int | None = None,
        password: str | None = None,
        is_superuser: bool = False,
        is_active: bool = False,
        is_staff: bool = False,
        **extra_fields,
    ) -> "Account":

        if not first_name:
            raise ValueError("Account must have a first name.")

        if not last_name:
            raise ValueError("Account must have a last name.")

        if not email:
            raise ValueError("Account must have an email.")

        if not role:
            raise ValueError("Account must have a role.")

        if default_allocated_leaves is None:
            raise ValueError("Account must have default allocated leaves.")

        if remaining_leaves is None:
            remaining_leaves = default_allocated_leaves

        account = self.model(
            email=self.normalize_email(email),
            first_name=first_name,
            last_name=last_name,
            role=role,
            default_allocated_leaves=default_allocated_leaves,
            current_year_allocated_leaves=remaining_leaves,
            remaining_leaves=remaining_leaves,
            is_superuser=is_superuser,
            is_active=is_active,
            is_staff=is_staff,
            **extra_fields,
        )
        account.set_password(password)
        account.save()

        return account

    def create_superuser(self, **fields) -> "Account":
        fields["is_superuser"] = True
        fields["is_active"] = True
        fields["is_staff"] = True
        return self.create_user(**fields)


class Account(auth_models.AbstractUser):
    username = None
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = [
        "first_name",
        "last_name",
        "default_allocated_leaves",
        "remaining_leaves",
        "role",
    ]
    objects = AccountManager()

    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)

    email = models.EmailField(max_length=254, unique=True)
    is_active = models.BooleanField(default=False)

    # Number of leaves allocated every year
    default_allocated_leaves = models.PositiveSmallIntegerField(
        validators=[MaxValueValidator(365)]
    )

    # Number of leaves allocated this year
    current_year_allocated_leaves = models.PositiveSmallIntegerField(
        validators=[MaxValueValidator(365)]
    )

    remaining_leaves = models.PositiveSmallIntegerField(
        validators=[MaxValueValidator(365)]
    )

    role = models.CharField(
        max_length=10, choices=AccountRole.choices, default=AccountRole.EMPLOYEE
    )

    created_on = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(
        "self",
        related_name="accounts_created",
        limit_choices_to={"role": AccountRole.ADMIN},
        null=True,
        on_delete=models.PROTECT,
    )

    modified_on = models.DateTimeField(auto_now=True)
    modified_by = models.ForeignKey(
        "self",
        related_name="accounts_modified",
        limit_choices_to={"role": AccountRole.ADMIN},
        null=True,
        on_delete=models.PROTECT,
    )
