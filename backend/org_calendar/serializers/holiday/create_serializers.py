from rest_framework import serializers
from django.utils import timezone
from account.models import Account
from org_calendar.models import Holiday


class HolidayCreateSerializer(serializers.ModelSerializer):
    date = serializers.DateField(source="date_of_holiday")

    class Meta:
        model = Holiday
        fields = [
            "name",
            "date",
        ]

    def validate_date(self, value):
        current_year = timezone.now().year
        if value.year <= current_year:
            raise serializers.ValidationError(
                f"Organization calendar till the year {current_year} is immutable."
            )

        return value

    def create(self, validated_data):
        # created and modified by system account (id=1)
        # this is meant to be temporary
        # when auth module is ready the user's account must be used here
        system_account = Account.objects.filter(id=1).first()
        validated_data["created_by"] = system_account
        validated_data["modified_by"] = system_account

        return Holiday.objects.create(**validated_data)


class HolidayCreateResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Holiday
        fields = ["id"]
        read_only_fields = fields
