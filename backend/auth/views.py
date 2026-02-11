from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenBlacklistView,
)
from rest_framework.generics import CreateAPIView
from server.utils.responses import ApiResponseMixin
from auth import serializers


class AuthTokenObtainPairView(ApiResponseMixin, TokenObtainPairView):
    pass


class AuthTokenRefreshView(ApiResponseMixin, TokenRefreshView):
    pass


class AuthTokenBlacklistView(ApiResponseMixin, TokenBlacklistView):
    pass


class AuthResetPasswordView(ApiResponseMixin, CreateAPIView):
    serializer_class = serializers.AuthPasswordResetSerializer
