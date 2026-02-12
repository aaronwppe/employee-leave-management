from rest_framework.routers import DefaultRouter
from leave import views

router = DefaultRouter()
router.register("leave", views.LeaveViewSet, basename="leave")
urlpatterns = router.urls
