from rest_framework_simplejwt.views import TokenObtainPairView
from server.utils.responses import ApiResponseMixin
from auth import serializers
from auth.views import utils


class AuthLoginView(ApiResponseMixin, TokenObtainPairView):
    serializer_class = serializers.AuthLoginSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        utils.set_cookie_and_remove_refresh_token(response)
        return response
