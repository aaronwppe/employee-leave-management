from rest_framework import viewsets, mixins
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED
from django.db.models import Q
from leave.models import Leave
from server.utils.responses import ApiResponseMixin
from account.models import AccountRole
from leave.permissions import LeavePermission
from leave import serializers


class LeaveViewSet(
    ApiResponseMixin,
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    http_method_names = ["get", "post", "delete"]
    queryset = Leave.objects.filter(is_deleted=False)
    pagination_class = None
    permission_classes = [LeavePermission]

    def get_queryset(self):
        queryset = super().get_queryset()

        if self.action != "list":
            return queryset

        if self.request.user.role == AccountRole.EMPLOYEE:
            queryset = queryset.filter(account=self.request.user)

        serializer = serializers.LeaveListRequestSerializer(
            data=self.request.query_params,
            context={"request": self.request},
        )
        serializer.is_valid(raise_exception=True)
        account = serializer.validated_data["account_id"]
        year = serializer.validated_data["year"]

        return queryset.filter(
            Q(account__id=account.id)
            & Q(Q(start_date__year=year) | Q(end_date__year=year))
        )

    def get_serializer_class(self):
        if self.action == "list":
            return serializers.LeaveListSerializer

        if self.action == "create":
            if self.request.user.role == AccountRole.ADMIN:
                return serializers.AdminLeaveCreateSerializer

            if self.request.user.role == AccountRole.EMPLOYEE:
                return serializers.EmployeeLeaveCreateSerializer

        raise NotImplementedError(
            f"Serializer for action '{self.action}' and role '{self.request.user.role}' has not been implemented."
        )

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        return Response(
            data={
                "leaves": response.data,
            },
            status=response.status_code,
        )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        instance = serializer.save()
        response_serializer = serializers.LeaveCreateResponseSerializer(instance)

        return Response(
            data=response_serializer.data,
            status=HTTP_201_CREATED,
        )

    def perform_destroy(self, instance):
        instance.soft_delete(self.request.user)
