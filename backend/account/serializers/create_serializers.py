from rest_framework import serializers
from account.models import Account


class AccountCreateSerializer(serializers.ModelSerializer):
    status = serializers.BooleanField(source="is_active")
    allocated_leaves = serializers.IntegerField(source="default_allocated_leaves")
    leaves_for_current_year = serializers.IntegerField(source="remaining_leaves")

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

    def create(self, validated_data):
        # created and modified by system account (id=1)
        # this is meant to be temporary
        # when auth module is ready the user's account must be used here
        system_account = Account.objects.filter(id=1).first()
        validated_data["created_by"] = system_account
        validated_data["modified_by"] = system_account

        return Account.objects.create_user(**validated_data)


class AccountCreateResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ["id"]
        read_only_fields = fields
