from django.contrib import admin
from account.models import Account


class _AccountAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "first_name",
        "last_name",
        "email",
        "default_allocated_leaves",
        "remaining_leaves",
    )


admin.site.register(Account, _AccountAdmin)
