from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from account.models import Account


class AccountUpdateSerializer(serializers.ModelSerializer):
    status = serializers.BooleanField(source="is_active")
    leaves_for_current_year = serializers.IntegerField(source="current_year_allocated_leaves")
    allocated_leaves = serializers.IntegerField(source="default_allocated_leaves")

    class Meta:
        model = Account
        fields = [
            "first_name",
            "last_name",
            "email",
            "leaves_for_current_year",
            "allocated_leaves",
            "status",
            "role",
        ]

    def update(self, instance, validated_data):
        request = self.context.get("request")

        if not request or not request.user:
            raise ValidationError({"detail": "User must be logged in"})

        validated_data["modified_by"] = request.user

        return super().update(instance, validated_data)
