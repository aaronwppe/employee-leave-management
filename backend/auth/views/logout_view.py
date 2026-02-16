from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.status import HTTP_200_OK
from server.utils.responses import ApiResponseMixin
from auth.views import utils


class AuthLogoutView(ApiResponseMixin, APIView):
    def post(self, request, *args, **kwargs):
        refresh_token = utils.get_refresh_token(request)

        if not refresh_token:
            raise ValidationError("Refresh token not found in cookies.")

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except TokenError:
            pass

        response = Response(status=HTTP_200_OK)
        utils.delete_cookie(response)

        return response
