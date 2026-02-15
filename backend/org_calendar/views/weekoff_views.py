from rest_framework import viewsets, mixins
from rest_framework.response import Response
from org_calendar import serializers
from server.utils.responses import ApiResponseMixin
from org_calendar.models import WeekOff
from org_calendar.permissions import OrgCalendarPermission


class WeekOffViewSet(
    ApiResponseMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    http_method_names = ["get"]
    queryset = WeekOff.objects.all()
    pagination_class = None
    permission_classes = [OrgCalendarPermission]

    def get_serializer_class(self):
        if self.action != "list":
            raise NotImplementedError(
                f"Serializer for action '{self.action}' has not been implemented."
            )

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = serializers.WeekOffListSerializer(queryset)
        return Response(serializer.data)
