from rest_framework import serializers
from org_calendar.models import Holiday


class HolidayListSerializer(serializers.ModelSerializer):
    date = serializers.DateField(source="date_of_holiday")

    class Meta:
        model = Holiday
        fields = [
            "id",
            "name",
            "date",
            "created_on",
        ]
        read_only_fields = fields


class HolidayListRequestSerializer(serializers.Serializer):
    year = serializers.IntegerField(min_value=2000, max_value=3000)
