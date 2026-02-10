from rest_framework.routers import DefaultRouter
from leave.views import LeaveViewSet

router = DefaultRouter()
router.register("leave", LeaveViewSet, basename="leave")

urlpatterns = router.urls
