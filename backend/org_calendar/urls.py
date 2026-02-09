from rest_framework.routers import DefaultRouter
from org_calendar import views

router = DefaultRouter()
router.register("holiday", views.HolidayViewSet)
urlpatterns = router.urls
