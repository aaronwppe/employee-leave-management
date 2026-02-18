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
    leaves_for_current_year = serializers.IntegerField(source="current_year_allocated_leaves")
    allocated_leaves = serializers.IntegerField(source="default_allocated_leaves")
    leaves_exhausted = serializers.SerializerMethodField()
    remaining_leaves = serializers.SerializerMethodField()
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
            "leaves_for_current_year",
            "leaves_exhausted",
            "remaining_leaves",
            "leave_applications",
            "last_modified_by",
            "last_modified_on",
        ]
        read_only_fields = fields

    def get_leaves_exhausted(self, obj: Account) -> int:
        current_year = timezone.now().year
        leaves = obj.leaves.filter(
            is_deleted=False,
            start_date__year=current_year,
        )
        return sum(l.number_of_leaves for l in leaves)

    def get_remaining_leaves(self, obj: Account) -> int:
        exhausted = self.get_leaves_exhausted(obj)
        return obj.current_year_allocated_leaves - exhausted

    def get_leave_applications(self, obj: Account) -> int:
        current_year = timezone.now().year
        return obj.leaves.filter(
            is_deleted=False,
            start_date__year=current_year,
        ).count()
