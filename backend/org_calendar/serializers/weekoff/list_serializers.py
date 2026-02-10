from rest_framework import serializers

_DAYS_OF_THE_WEEK = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
]


class WeekOffListSerializer(serializers.Serializer):
    weekoffs = serializers.SerializerMethodField()

    def get_weekoffs(self, obj):
        return {
            str(weekoff.week_of_month): [
                day.upper()
                for day in _DAYS_OF_THE_WEEK
                if getattr(weekoff, day) == True
            ]
            for weekoff in obj
        }
