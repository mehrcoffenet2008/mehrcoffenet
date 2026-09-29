from django.contrib import admin
from django.urls import path, include, re_path
from .spa_views import FrontendView

urlpatterns = [
    path("admin/", admin.site.urls),

    path("api/", include("services.urls")),

    path("api/", include("orders.urls")),

    # SPA - serve frontend for all other routes
    re_path(r"^(?!api/|admin/|static/).*$", FrontendView.as_view()),
]