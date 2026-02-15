from django.urls import path
from auth import views

urlpatterns = [
    path(
        "auth/login/",
        views.AuthLoginView.as_view(),
        name="token_obtain_pair",
    ),
    path(
        "auth/refresh/",
        views.AuthRefreshView.as_view(),
        name="token_refresh",
    ),
    path(
        "auth/logout/",
        views.AuthLogoutView.as_view(),
        name="token_blacklist",
    ),
    path(
        "auth/password-reset/confirm/",
        views.AuthResetPasswordView.as_view(),
        name="password_reset",
    ),
]
