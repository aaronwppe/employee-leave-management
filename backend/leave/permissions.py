from rest_framework import permissions
from account.models import AccountRole


class LeavePermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        if request.user.role not in [AccountRole.ADMIN, AccountRole.EMPLOYEE]:
            return False

        if view.action == "create" and request.user.role == AccountRole.EMPLOYEE:
            account_id = request.data.get("account_id")
            if account_id is not None:
                return False

        return True

    def has_object_permission(self, request, view, obj):
        if request.user.role == AccountRole.ADMIN:
            return True

        if request.user.role == AccountRole.EMPLOYEE:
            return obj.account == request.user

        return False
