from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenBlacklistView,
)
from server.utils.responses import ApiResponseMixin


class AuthTokenObtainPairView(ApiResponseMixin, TokenObtainPairView):
    pass


class AuthTokenRefreshView(ApiResponseMixin, TokenRefreshView):
    pass


class AuthTokenBlacklistView(ApiResponseMixin, TokenBlacklistView):
    pass
