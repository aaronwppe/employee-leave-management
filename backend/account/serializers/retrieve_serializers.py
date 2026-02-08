from rest_framework import serializers
from django.utils import timezone
from account.models import Account


class _AccountModifierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = [
            "id",
            "first_name",
            "last_name",
        ]
        read_only_fields = fields


class AccountRetrieveSerializer(serializers.ModelSerializer):
    status = serializers.BooleanField(source="is_active")
    allocated_leaves = serializers.IntegerField(source="default_allocated_leaves")
    leaves_exhausted = serializers.SerializerMethodField()
    leave_applications = serializers.SerializerMethodField()
    last_modified_by = _AccountModifierSerializer(source="modified_by")
    last_modified_on = serializers.DateTimeField(source="modified_on")

    class Meta:
        model = Account
        fields = [
            "id",
            "first_name",
            "last_name",
            "email",
            "role",
            "status",
            "allocated_leaves",
            "leaves_exhausted",
            "remaining_leaves",
            "leave_applications",
            "last_modified_by",
            "last_modified_on",
        ]
        read_only_fields = fields

    def get_leaves_exhausted(self, obj: Account) -> int:
        return obj.current_year_allocated_leaves - obj.remaining_leaves

    def get_leave_applications(self, obj: Account) -> int:
        current_year = timezone.now().year
        return obj.leaves.filter(created_on__year=current_year).count()
