from rest_framework import serializers
from django.utils import timezone
from leave.models import Leave
from account.models import Account


class _LeaveCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Leave
        fields = [
            "start_date",
            "end_date",
            "reason",
        ]

    def validate(self, attrs):
        start_date = attrs["start_date"]
        end_date = attrs["end_date"]

        today = timezone.now().date()
        current_year = today.year

        if start_date > end_date:
            raise serializers.ValidationError("Start date cannot be after end date.")

        if start_date < timezone.now().date():
            raise serializers.ValidationError("Cannot apply leave in the past.")

        if start_date.year != current_year or end_date.year != current_year:
            raise serializers.ValidationError(
                "Leave can be applied only for the current year."
            )

        return attrs


class EmployeeLeaveCreateSerializer(_LeaveCreateSerializer):
    def create(self, validated_data):
        request = self.context.get("request")

        if not request or not request.user:
            raise serializers.ValidationError({"detail": "User must be logged in"})

        validated_data["account"] = request.user
        validated_data["created_by"] = request.user

        return Leave.create_leave(**validated_data)


class AdminLeaveCreateSerializer(_LeaveCreateSerializer):
    account_id = serializers.PrimaryKeyRelatedField(
        queryset=Account.objects.all(),
        source="account",
        required=False,
    )

    class Meta:
        model = Leave
        fields = [
            "account_id",
            "start_date",
            "end_date",
            "reason",
        ]

    def create(self, validated_data):
        request = self.context.get("request")

        if not request or not request.user:
            raise serializers.ValidationError({"detail": "User must be logged in"})

        validated_data["created_by"] = request.user

        account = validated_data.get("account")
        if account is None:
            account = request.user

        validated_data["account"] = account

        return Leave.create_leave(**validated_data)


class LeaveCreateResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Leave
        fields = ["id"]
        read_only_fields = fields
