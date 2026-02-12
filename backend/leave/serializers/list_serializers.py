from rest_framework import serializers
from leave.models import Leave
from account.models import Account
from django.utils import timezone


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


class LeaveListRequestSerializer(serializers.Serializer):
    account_id = serializers.PrimaryKeyRelatedField(
        queryset=Account.objects.all(),
        required=False,
    )
    year = serializers.IntegerField(
        min_value=2000,
        max_value=3000,
        required=False,
        default=timezone.now().year,
    )
