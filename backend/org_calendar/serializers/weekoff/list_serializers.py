from rest_framework import serializers
from org_calendar.models import WeekOff


class WeekOffSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeekOff
        fields = ["id", "day", "weeks"]


class WeekOffListSerializer(serializers.Serializer):
    weekoffs = serializers.SerializerMethodField()

    def get_weekoffs(self, obj):
        result = {}

        for weekoff in obj:
            result[weekoff.day] = weekoff.weeks

        return result
