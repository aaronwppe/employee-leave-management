from rest_framework import viewsets, mixins,status
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED
from django.db.models import Q
from leave.models import Leave
from server.utils.responses import ApiResponseMixin
from account.models import AccountRole
from leave.permissions import LeavePermission
from leave import serializers
from django.core.exceptions import ValidationError
from django.utils.timezone import now



class LeaveViewSet(
    ApiResponseMixin,
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    http_method_names = ["get", "post", "delete"]
    queryset = Leave.objects.all()
    pagination_class = None
    permission_classes = [LeavePermission]

    def get_queryset(self):
        queryset = Leave.objects.filter(is_deleted=False)

        if self.action != "list":
            return queryset

        year = self.request.query_params.get("year")

        if year:
            queryset = queryset.filter(
                Q(start_date__year=year) | Q(end_date__year=year)
            )

        # Employee → only their leaves
        if self.request.user.role == AccountRole.EMPLOYEE:
            return queryset.filter(account=self.request.user)

        # Admin → optional account filter
        account_id = self.request.query_params.get("account_id")
        if account_id:
            queryset = queryset.filter(account__id=account_id)

        return queryset


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

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        try:
            self.perform_destroy(instance)
        except ValidationError as e:
            return Response(
                {"message": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {"message": "Leave deleted successfully"},
            status=status.HTTP_200_OK,
        )
    
    def perform_destroy(self, instance):
        # Prevent deleting past or current leaves
        if instance.start_date <= now().date():
            raise ValidationError("Past or current leaves cannot be deleted.")
        instance.soft_delete(self.request.user)
