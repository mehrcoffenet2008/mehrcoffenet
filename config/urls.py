from django.contrib import admin
from django.urls import path, include, re_path
from .spa_views import FrontendView
from .auth_views import (
    LoginView, RegisterView, LogoutView, UserProfileView, CSRFView,
    ChangePasswordView, SendCodeView, VerifyCodeView, CompleteRegistrationView,
)

urlpatterns = [
    path("admin/", admin.site.urls),

    path("api/", include("services.urls")),

    path("api/", include("orders.urls")),

    # Auth
    path("api/auth/login/", LoginView.as_view()),
    path("api/auth/register/", RegisterView.as_view()),
    path("api/auth/logout/", LogoutView.as_view()),
    path("api/auth/profile/", UserProfileView.as_view()),
    path("api/auth/change-password/", ChangePasswordView.as_view()),
    path("api/auth/csrf/", CSRFView.as_view()),

    # Email verification registration
    path("api/auth/send-code/", SendCodeView.as_view()),
    path("api/auth/verify-code/", VerifyCodeView.as_view()),
    path("api/auth/complete-registration/", CompleteRegistrationView.as_view()),

    # SPA - serve frontend for all other routes
    re_path(r"^(?!api/|admin/|static/).*$", FrontendView.as_view()),
]