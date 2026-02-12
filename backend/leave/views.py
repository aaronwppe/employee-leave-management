from rest_framework import viewsets, mixins, permissions
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED
from django.db.models import Q
from leave.models import Leave
from leave import serializers
from server.utils.responses import ApiResponseMixin
from account.models import Account


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
    # permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()

        if self.action != "list":
            return queryset

        query_params = {
            key: self.request.query_params.get(key) for key in self.request.query_params
        }
        if query_params.get("account_id") is None:
            # system id = 1
            # this is a temporary fix
            query_params["account_id"] = 1

        serializer = serializers.LeaveListRequestSerializer(
            data=query_params,
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
            return serializers.LeaveCreateSerializer

        raise NotImplementedError(
            f"Serializer for action '{self.action}' has not been implemented."
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
        system_account = Account.objects.get(id=1)
        instance.soft_delete(system_account)
