from rest_framework.response import Response
from rest_framework.request import Request
from server import settings
from rest_framework_simplejwt.settings import api_settings


_REFRESH_COOKIE_KEY = "refresh_token"
_REFRESH_COOKIE_PATH = "/api/auth/"


def get_refresh_token(request: Request) -> str | None:
    return request.COOKIES.get(_REFRESH_COOKIE_KEY, None)


def set_cookie_and_remove_refresh_token(response: Response) -> None:
    refresh_token = response.data.get("refresh")

    if refresh_token is None:
        return

    max_age = int(api_settings.REFRESH_TOKEN_LIFETIME.total_seconds())

    response.set_cookie(
        key=_REFRESH_COOKIE_KEY,
        value=refresh_token,
        max_age=max_age,
        httponly=True,
        secure=not settings.DEBUG,
        samesite="Lax",
        path=_REFRESH_COOKIE_PATH,
    )

    response.data.pop("refresh", None)


def delete_cookie(response: Response) -> None:
    response.delete_cookie(
        key=_REFRESH_COOKIE_KEY,
        path=_REFRESH_COOKIE_PATH,
    )
