from rest_framework import serializers
from account.models import Account


class AccountUpdateSerializer(serializers.ModelSerializer):
    status = serializers.BooleanField(source="is_active")
    allocated_leaves = serializers.IntegerField(source="default_allocated_leaves")

    class Meta:
        model = Account
        fields = [
            "first_name",
            "last_name",
            "email",
            "allocated_leaves",
            "status",
            "role",
        ]

    def update(self, instance, validated_data):
        # modified by system account (id=1)
        # this is meant to be temporary
        # when auth module is ready the user's account must be used here
        system_account = Account.objects.filter(id=1).first()
        validated_data["modified_by"] = system_account

        return super().update(instance, validated_data)
