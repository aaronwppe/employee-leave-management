from rest_framework import viewsets
from account.models import Account
from account import serializers
from server.utils.responses import ApiResponseMixin
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_201_CREATED


class AccountViewSet(ApiResponseMixin, viewsets.ModelViewSet):
    http_method_names = ["get", "post", "patch", "put"]
    queryset = Account.objects.all()

    def get_serializer_class(self):
        if self.action == "list":
            return serializers.AccountListSerializer

        if self.action == "create":
            return serializers.AccountCreateSerializer

        if self.action in ["update", "partial_update"]:
            return serializers.AccountUpdateSerializer

        # "retrieve":
        return serializers.AccountRetrieveSerializer

    def paginate_queryset(self, queryset):
        results = super().paginate_queryset(queryset)

        if results is not None:
            self.paginator.total_count_key = "total_accounts"
            self.paginator.results_key = "accounts"

        return results

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        instance = serializer.save()

        response_serializer = serializers.AccountCreateResponseSerializer(instance)
        return Response(
            data=response_serializer.data,
            status=HTTP_201_CREATED,
        )

    def update(self, request, *args, **kwargs):
        is_partial_update = self.action == "partial_update"
        instance = self.get_object()

        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=is_partial_update,
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            data={},
            status=HTTP_200_OK,
        )

    def partial_update(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)
