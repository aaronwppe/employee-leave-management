from rest_framework import viewsets, mixins, permissions
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED
from org_calendar import serializers
from server.utils.responses import ApiResponseMixin
from org_calendar.models import WeekOff
from account.models import Account


class WeekOffViewSet(
    ApiResponseMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    http_method_names = ["get"]
    queryset = WeekOff.objects.all()
    pagination_class = None
    # permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action != "list":
            raise NotImplementedError(
                f"Serializer for action '{self.action}' has not been implemented."
            )

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = serializers.WeekOffListSerializer(queryset)
        return Response(serializer.data)
