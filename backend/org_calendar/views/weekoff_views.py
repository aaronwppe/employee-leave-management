from rest_framework import viewsets, mixins, permissions
from rest_framework.response import Response
from org_calendar import serializers
from org_calendar.models import WeekOff
from account.models import AccountRole


class IsAdminRole(permissions.BasePermission):
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == AccountRole.ADMIN
        )


class WeekOffViewSet(
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    http_method_names = ["get"]
    queryset = WeekOff.objects.all()
    serializer_class = serializers.WeekOffListSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset)
        return Response(serializer.data)
