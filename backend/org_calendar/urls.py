from rest_framework.routers import DefaultRouter
from org_calendar import views

router = DefaultRouter()
router.register("holiday", views.HolidayViewSet)
router.register("weekoff", views.WeekOffViewSet)
urlpatterns = router.urls
