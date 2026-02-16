from rest_framework import permissions
from account.models import AccountRole


class AccountPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        if request.user.role == AccountRole.ADMIN:
            return True

        if request.user.role == AccountRole.EMPLOYEE and view.action == "retrieve":
            return True

        return False

    def has_object_permission(self, request, view, obj):
        if request.user.role == AccountRole.ADMIN:
            return True

        if request.user.role == AccountRole.EMPLOYEE and view.action == "retrieve":
            return obj.id == request.user.id

        return False
