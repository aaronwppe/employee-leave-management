from rest_framework import viewsets
from account.models import Account
from account import serializers
from server.utils.responses import ApiResponseMixin
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_201_CREATED
from django.db import transaction
from account import services


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

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        instance = serializer.save()
        if instance.is_active:
            services.send_activation_email(account=instance)

        response_serializer = serializers.AccountCreateResponseSerializer(instance)
        return Response(
            data=response_serializer.data,
            status=HTTP_201_CREATED,
        )

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        is_partial_update = self.action == "partial_update"

        instance = self.get_object()
        prev_status = instance.is_active

        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=is_partial_update,
        )
        serializer.is_valid(raise_exception=True)
        updated_instance = serializer.save()

        if (
            not prev_status
            and updated_instance.is_active == True
            and not updated_instance.has_usable_password()
        ):
            services.send_activation_email(account=updated_instance)
        elif not updated_instance.is_active and updated_instance.has_usable_password():
            updated_instance.set_password(None)
            updated_instance.save()

        return Response(
            data={},
            status=HTTP_200_OK,
        )
