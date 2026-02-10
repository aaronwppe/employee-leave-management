from rest_framework import serializers
from django.utils import timezone
from leave.models import Leave
from account.models import Account



class LeaveCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Leave
        fields = ["start_date", "end_date", "reason"]

    def validate(self, attrs):
        start_date = attrs["start_date"]
        end_date = attrs["end_date"]

        today=timezone.now().date()
        current_year=today.year

        if start_date > end_date:
            raise serializers.ValidationError("Start date cannot be after end date.")

        if start_date < timezone.now().date():
            raise serializers.ValidationError("Cannot apply leave in the past.")
        
        if start_date.year != current_year or end_date.year !=current_year:
            raise serializers.ValidationError("Leave can be applied only for the current year.")
        
        return attrs

    def create(self, validated_data):
        request = self.context["request"]

        system_account = Account.objects.filter(
            email="system0@gmail.com"
        ).first()

        if not system_account:
            raise serializers.ValidationError(
                "System account not found."
            )

        account = system_account

        total_days = (
         validated_data["end_date"] - validated_data["start_date"]
        ).days + 1

        if account.remaining_leaves < total_days:
            raise serializers.ValidationError(
             "Cannot apply for this leave."
        )

        leave = Leave.objects.create(
            account=account,
            number_of_leaves=total_days,
            **validated_data,
        )

        account.remaining_leaves -= total_days
        account.save(update_fields=["remaining_leaves"])

        return leave

class LeaveCreateResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Leave
        fields = ["id"]
        read_only_fields = fields
