from rest_framework import viewsets, mixins
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED
from org_calendar import serializers
from server.utils.responses import ApiResponseMixin
from org_calendar.models import Holiday
from account.models import Account
from org_calendar.permissions import OrgCalendarPermission


class HolidayViewSet(
    ApiResponseMixin,
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    http_method_names = ["get", "post", "delete"]
    queryset = Holiday.objects.filter(is_deleted=False)
    pagination_class = None
    permission_classes = [OrgCalendarPermission]

    def get_serializer_class(self):
        if self.action == "list":
            return serializers.HolidayListSerializer

        if self.action == "create":
            return serializers.HolidayCreateSerializer

        raise NotImplementedError(
            f"Serializer for action '{self.action}' has not been implemented."
        )

    def get_queryset(self):
        queryset = super().get_queryset()

        if self.action != "list":
            return queryset

        serializer = serializers.HolidayListRequestSerializer(
            data=self.request.query_params
        )
        serializer.is_valid(raise_exception=True)
        year = serializer.validated_data["year"]

        return queryset.filter(date_of_holiday__year=year)

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        return Response(
            data={
                "holidays": response.data,
            },
            status=response.status_code,
        )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        instance = serializer.save()
        response_serializer = serializers.HolidayCreateResponseSerializer(instance)

        return Response(
            data=response_serializer.data,
            status=HTTP_201_CREATED,
        )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        response = Response(status=200)
        return response
    def perform_destroy(self, instance):
        # system account (id=1)
        # this is meant to be temporary
        # when auth module is ready the user's account must be used here
        system_account = Account.objects.filter(id=1).first()
        instance.soft_delete(system_account)

