from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.utils.decorators import method_decorator
import json


def user_json(user):
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
    }


@method_decorator(csrf_exempt, name="dispatch")
class LoginView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            username = data.get("username", "").strip()
            password = data.get("password", "")
            remember = data.get("remember", False)

            if not username or not password:
                return JsonResponse(
                    {"error": "نام کاربری و رمز عبور الزامی است"}, status=400
                )

            user = authenticate(request, username=username, password=password)
            if user is None:
                return JsonResponse(
                    {"error": "نام کاربری یا رمز عبور اشتباه است"}, status=401
                )

            login(request, user)

            # Remember me: 2 weeks vs session-only (browser close)
            if remember:
                request.session.set_expiry(60 * 60 * 24 * 14)
            else:
                request.session.set_expiry(0)

            return JsonResponse({"success": True, "user": user_json(user)})
        except json.JSONDecodeError:
            return JsonResponse({"error": "داده نامعتبر"}, status=400)


@method_decorator(csrf_exempt, name="dispatch")
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

            if len(username) < 3:
                return JsonResponse(
                    {"error": "نام کاربری باید حداقل ۳ کاراکتر باشد"}, status=400
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
            request.session.set_expiry(60 * 60 * 24 * 14)
            return JsonResponse(
                {"success": True, "user": user_json(user)}, status=201
            )
        except json.JSONDecodeError:
            return JsonResponse({"error": "داده نامعتبر"}, status=400)


@method_decorator(csrf_exempt, name="dispatch")
class LogoutView(View):
    def post(self, request):
        logout(request)
        return JsonResponse({"success": True})


class UserProfileView(View):
    def get(self, request):
        if not request.user.is_authenticated:
            return JsonResponse({"error": "کاربر وارد نشده است"}, status=401)
        return JsonResponse(
            {
                **user_json(request.user),
                "date_joined": request.user.date_joined.strftime("%Y-%m-%d"),
                "last_login": (
                    request.user.last_login.strftime("%Y-%m-%d %H:%M")
                    if request.user.last_login
                    else None
                ),
            }
        )

    @method_decorator(csrf_exempt)
    def put(self, request):
        if not request.user.is_authenticated:
            return JsonResponse({"error": "کاربر وارد نشده است"}, status=401)
        try:
            data = json.loads(request.body)
            user = request.user

            email = data.get("email", "").strip()
            first_name = data.get("first_name", "").strip()
            last_name = data.get("last_name", "").strip()

            if email and User.objects.filter(email=email).exclude(pk=user.pk).exists():
                return JsonResponse(
                    {"error": "این ایمیل توسط کاربر دیگری استفاده شده"}, status=400
                )

            user.email = email
            user.first_name = first_name
            user.last_name = last_name
            user.save()

            return JsonResponse({"success": True, "user": user_json(user)})
        except json.JSONDecodeError:
            return JsonResponse({"error": "داده نامعتبر"}, status=400)


@method_decorator(csrf_exempt, name="dispatch")
class ChangePasswordView(View):
    def post(self, request):
        if not request.user.is_authenticated:
            return JsonResponse({"error": "کاربر وارد نشده است"}, status=401)
        try:
            data = json.loads(request.body)
            old_password = data.get("old_password", "")
            new_password = data.get("new_password", "")

            if not old_password or not new_password:
                return JsonResponse(
                    {"error": "رمز عبور فعلی و جدید الزامی است"}, status=400
                )

            if not request.user.check_password(old_password):
                return JsonResponse(
                    {"error": "رمز عبور فعلی اشتباه است"}, status=400
                )

            try:
                validate_password(new_password, request.user)
            except Exception as e:
                return JsonResponse(
                    {"error": list(e.messages)[0]}, status=400
                )

            request.user.set_password(new_password)
            request.user.save()
            update_session_auth_hash(request, request.user)

            return JsonResponse({"success": True})
        except json.JSONDecodeError:
            return JsonResponse({"error": "داده نامعتبر"}, status=400)


@method_decorator(ensure_csrf_cookie, name="dispatch")
class CSRFView(View):
    def get(self, request):
        return JsonResponse({"success": True})
