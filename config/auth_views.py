from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
import json


class LoginView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            username = data.get("username", "").strip()
            password = data.get("password", "")

            if not username or not password:
                return JsonResponse(
                    {"error": "نام کاربری و رمز عبور الزامی است"}, status=400
                )

            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return JsonResponse(
                    {
                        "success": True,
                        "user": {
                            "id": user.id,
                            "username": user.username,
                            "email": user.email,
                            "first_name": user.first_name,
                            "last_name": user.last_name,
                        },
                    }
                )
            else:
                return JsonResponse(
                    {"error": "نام کاربری یا رمز عبور اشتباه است"}, status=401
                )
        except json.JSONDecodeError:
            return JsonResponse({"error": "داده نامعتبر"}, status=400)


class RegisterView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            username = data.get("username", "").strip()
            password = data.get("password", "")
            email = data.get("email", "").strip()
            first_name = data.get("first_name", "").strip()
            last_name = data.get("last_name", "").strip()

            if not username or not password:
                return JsonResponse(
                    {"error": "نام کاربری و رمز عبور الزامی است"}, status=400
                )

            if len(password) < 6:
                return JsonResponse(
                    {"error": "رمز عبور باید حداقل ۶ کاراکتر باشد"}, status=400
                )

            if User.objects.filter(username=username).exists():
                return JsonResponse(
                    {"error": "این نام کاربری قبلاً ثبت شده است"}, status=400
                )

            if email and User.objects.filter(email=email).exists():
                return JsonResponse(
                    {"error": "این ایمیل قبلاً ثبت شده است"}, status=400
                )

            user = User.objects.create_user(
                username=username,
                password=password,
                email=email,
                first_name=first_name,
                last_name=last_name,
            )
            login(request, user)
            return JsonResponse(
                {
                    "success": True,
                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "email": user.email,
                        "first_name": user.first_name,
                        "last_name": user.last_name,
                    },
                },
                status=201,
            )
        except json.JSONDecodeError:
            return JsonResponse({"error": "داده نامعتبر"}, status=400)


class LogoutView(View):
    def post(self, request):
        logout(request)
        return JsonResponse({"success": True})


class UserProfileView(View):
    def get(self, request):
        if request.user.is_authenticated:
            return JsonResponse(
                {
                    "id": request.user.id,
                    "username": request.user.username,
                    "email": request.user.email,
                    "first_name": request.user.first_name,
                    "last_name": request.user.last_name,
                    "date_joined": request.user.date_joined.strftime("%Y-%m-%d"),
                }
            )
        return JsonResponse({"error": "کاربر وارد نشده است"}, status=401)


@method_decorator(ensure_csrf_cookie, name="dispatch")
class CSRFView(View):
    def get(self, request):
        return JsonResponse({"success": True})
