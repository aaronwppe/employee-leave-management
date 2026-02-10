from django.shortcuts import render

# Create your views here.
from django.utils import timezone
from rest_framework import viewsets
from rest_framework.response import Response
from account.models import Account
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_201_CREATED,
    HTTP_400_BAD_REQUEST,
    HTTP_403_FORBIDDEN,
    HTTP_404_NOT_FOUND,
    HTTP_409_CONFLICT,
)
from leave.models import Leave
from leave import serializers
from server.utils.responses import ApiResponseMixin


class LeaveViewSet(ApiResponseMixin, viewsets.ModelViewSet):
    http_method_names = ["get", "post", "delete"]

    def get_queryset(self):
        request = self.request

        system_account = Account.objects.filter(
            email="system0@gmail.com"
        ).first()

        if not system_account:
            return Leave.objects.none()

        account_id = request.query_params.get(
            "account_id", system_account.id
        )

        year = request.query_params.get(
            "year", timezone.now().year
        )

        queryset = Leave.objects.filter(
            account_id=account_id,
            is_deleted=False,
            created_on__year=year,
        )

        return queryset.order_by("-created_on")


    def get_serializer_class(self):
        if self.action == "list":
            return serializers.LeaveListSerializer
        if self.action == "create":
            return serializers.LeaveCreateSerializer
        return serializers.LeaveListSerializer

    def paginate_queryset(self, queryset):
        results = super().paginate_queryset(queryset)

        if results is not None:
            self.paginator.total_count_key = "total_leaves"
            self.paginator.results_key = "leaves"

        return results

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page, many=True)

        return self.get_paginated_response(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)

        instance = serializer.save()
        response_serializer = serializers.LeaveCreateResponseSerializer(instance)

        return Response(
            data=response_serializer.data,
            status=HTTP_201_CREATED,
        )

    def destroy(self, request, pk=None):
        try:
            leave = Leave.objects.get(pk=pk, is_deleted=False)
        except Leave.DoesNotExist:
            return Response(
                data={"error": "Leave id is invalid"},
                status=HTTP_404_NOT_FOUND,
            )

        if leave.start_date <= timezone.now().date():
            return Response(
                data={"error": "Cannot delete this leave."},
                status=HTTP_409_CONFLICT,
            )

        leave.delete()

        leave.account.remaining_leaves += leave.number_of_leaves
        leave.account.save(update_fields=["remaining_leaves"])

        return Response(
            data={},
            status=HTTP_200_OK,
        )
