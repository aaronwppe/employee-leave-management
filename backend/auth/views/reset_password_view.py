from rest_framework.generics import CreateAPIView
from server.utils.responses import ApiResponseMixin
from auth import serializers


class AuthResetPasswordView(ApiResponseMixin, CreateAPIView):
    serializer_class = serializers.AuthPasswordResetSerializer
