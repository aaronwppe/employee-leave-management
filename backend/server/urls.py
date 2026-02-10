from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path(
        "api/",
        include(
            [
                path("", include("auth.urls")),
                path("", include("account.urls")),
                path("", include("org_calendar.urls")),
                path("", include("leave.urls")),
            ]
        ),
    ),
]
