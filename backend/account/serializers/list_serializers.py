from rest_framework import serializers
from account.models import Account


class AccountListSerializer(serializers.ModelSerializer):
    status = serializers.BooleanField(source="is_active")
    allocated_leaves = serializers.IntegerField(source="default_allocated_leaves")

    class Meta:
        model = Account
        fields = [
            "id",
            "first_name",
            "last_name",
            "email",
            "status",
            "allocated_leaves",
        ]
        read_only_fields = fields
