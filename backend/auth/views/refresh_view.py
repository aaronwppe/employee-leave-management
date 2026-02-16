from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework.response import Response
from rest_framework.status import HTTP_401_UNAUTHORIZED
from server.utils.responses import ApiResponseMixin
from auth.views import utils


class AuthRefreshView(ApiResponseMixin, TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get("refresh_token")

        if refresh_token is None:
            return Response(
                {"detail": "Refresh token not provided."},
                status=HTTP_401_UNAUTHORIZED,
            )

        serializer = self.get_serializer(data={"refresh": refresh_token})
        try:
            serializer.is_valid(raise_exception=True)
        except TokenError:
            return Response(
                {"detail": "Refresh token is invalid."},
                status=HTTP_401_UNAUTHORIZED,
            )

        response = Response(serializer.validated_data)
        utils.set_cookie_and_remove_refresh_token(response)

        return response
