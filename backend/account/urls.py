from rest_framework.routers import DefaultRouter
from account import views

router = DefaultRouter()
router.register("account", views.AccountViewSet)
urlpatterns = router.urls
