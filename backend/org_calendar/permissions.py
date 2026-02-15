from rest_framework import permissions
from account.models import AccountRole


class OrgCalendarPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        if request.user.role == AccountRole.ADMIN:
            return True

        if request.user.role == AccountRole.EMPLOYEE and view.action == "list":
            return True

        return False
