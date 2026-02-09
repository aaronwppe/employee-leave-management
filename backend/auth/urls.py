from django.urls import path
from auth import views

urlpatterns = [
    path(
        "auth/login/", views.AuthTokenObtainPairView.as_view(), name="token_obtain_pair"
    ),
    path("auth/refresh/", views.AuthTokenRefreshView.as_view(), name="token_refresh"),
    path(
        "auth/logout/", views.AuthTokenBlacklistView.as_view(), name="token_blacklist"
    ),
]
