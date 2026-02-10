from rest_framework import serializers
from leave.models import Leave


class LeaveListSerializer(serializers.ModelSerializer):
    total_days = serializers.IntegerField(source="number_of_leaves")
    applied_on = serializers.SerializerMethodField()

    class Meta:
        model = Leave
        fields = [
            "id",
            "total_days",
            "start_date",
            "end_date",
            "reason",
            "applied_on",
        ]
        read_only_fields = fields

    def get_applied_on(self, obj):
        return obj.created_on.date()
