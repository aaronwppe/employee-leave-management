from rest_framework import serializers
from account.models import Account


class AccountListSerializer(serializers.ModelSerializer):
    status = serializers.BooleanField(source="is_active")
    leaves_for_current_year = serializers.IntegerField(source="current_year_allocated_leaves")
    allocated_leaves = serializers.IntegerField(source="default_allocated_leaves")

    class Meta:
        model = Account
        fields = [
            "id",
            "first_name",
            "last_name",
            "email",
            "status",
            "leaves_for_current_year",
            "allocated_leaves",
        ]
        read_only_fields = fields
