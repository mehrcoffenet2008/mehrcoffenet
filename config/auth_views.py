from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.cache import cache
from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.utils.decorators import method_decorator
import json
import re

from accounts.models import Profile
from config.verification import send_code, verify_code, is_verified, clear_verification
from django.conf import settings

EMAIL_HOST = getattr(settings, "EMAIL_HOST", "")

# Rate limiting: max 5 failed attempts per username/IP, then 15 min lock
MAX_LOGIN_ATTEMPTS = 5
LOCKOUT_SECONDS = 60 * 15

IRAN_PHONE_RE = re.compile(r"^09\d{9}$")


def user_json(user):
    phone = ""
    try:
        phone = user.profile.phone
    except Profile.DoesNotExist:
        pass
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "phone": phone,
    }


def _client_ip(request):
    forwarded = request.META.get("HTTP_X_FORWARDED_FOR")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR", "unknown")


@method_decorator(csrf_exempt, name="dispatch")
class LoginView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            login_id = data.get("username", data.get("email", "")).strip()
            password = data.get("password", "")
            remember = data.get("remember", False)

            if not login_id or not password:
                return JsonResponse(
                    {"error": "نام کاربری یا ایمیل و رمز عبور الزامی است"}, status=400
                )

            # Find user by email OR username
            target_user = None
            if "@" in login_id:
                try:
                    target_user = User.objects.get(email__iexact=login_id)
                except User.DoesNotExist:
                    target_user = None
            else:
                target_user = User.objects.filter(username__iexact=login_id).first()

            # Rate limiting check
            ip = _client_ip(request)
            lock_key = f"login_lock:{login_id}:{ip}"
            fail_key = f"login_fail:{login_id}:{ip}"
            if cache.get(lock_key):
                return JsonResponse(
                    {"error": "به دلیل تلاش‌های ناموفق، ورود موقتاً مسدود شد. ۱۵ دقیقه دیگر دوباره تلاش کنید."},
                    status=429,
                )

            user = None
            if target_user is not None:
                user = authenticate(
                    request, username=target_user.username, password=password
                )

            if user is None:
                fails = cache.get(fail_key, 0) + 1
                cache.set(fail_key, fails, LOCKOUT_SECONDS)
                if fails >= MAX_LOGIN_ATTEMPTS:
                    cache.set(lock_key, True, LOCKOUT_SECONDS)
                    return JsonResponse(
                        {"error": "به دلیل ۵ تلاش ناموفق، ورود به مدت ۱۵ دقیقه مسدود شد."},
                        status=429,
                    )
                return JsonResponse(
                    {"error": f"ایمیل یا رمز عبور اشتباه است ({MAX_LOGIN_ATTEMPTS - fails} تلاش باقی مانده)"},
                    status=401,
                )

            # Success: clear failures
            cache.delete(fail_key)
            cache.delete(lock_key)

            login(request, user)

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
            phone = data.get("phone", "").strip().replace(" ", "").replace("-", "")

            # Required fields
            if not username or not password or not phone or not first_name or not last_name:
                return JsonResponse(
                    {"error": "شماره موبایل، نام، نام خانوادگی، نام کاربری و رمز عبور الزامی است"},
                    status=400,
                )

            # Email is required (login is via email)
            if not email:
                return JsonResponse(
                    {"error": "ایمیل الزامی است (ورود با ایمیل انجام می‌شود)"},
                    status=400,
                )

            if not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email):
                return JsonResponse(
                    {"error": "ایمیل معتبر نیست"}, status=400
                )

            # Phone validation (Iranian format)
            if not IRAN_PHONE_RE.match(phone):
                return JsonResponse(
                    {"error": "شماره موبایل معتبر نیست (مثال: 09123456789)"},
                    status=400,
                )

            if Profile.objects.filter(phone=phone).exists():
                return JsonResponse(
                    {"error": "این شماره موبایل قبلاً ثبت شده است"}, status=400
                )

            if len(username) < 3:
                return JsonResponse(
                    {"error": "نام کاربری باید حداقل ۳ کاراکتر باشد"}, status=400
                )

            # Password strength validation (Django validators)
            if len(password) < 8:
                return JsonResponse(
                    {"error": "رمز عبور باید حداقل ۸ کاراکتر باشد"}, status=400
                )

            temp_user = User(username=username, email=email, first_name=first_name, last_name=last_name)
            try:
                validate_password(password, temp_user)
            except Exception as e:
                return JsonResponse({"error": list(e.messages)[0]}, status=400)

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
            Profile.objects.create(user=user, phone=phone)

            login(request, user)
            request.session.set_expiry(60 * 60 * 24 * 14)

            # Welcome email (never blocks registration)
            if email:
                from config.emails import notify_welcome
                notify_welcome(email, first_name)

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
                return JsonResponse({"error": list(e.messages)[0]}, status=400)

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


@method_decorator(csrf_exempt, name="dispatch")
class SendCodeView(View):
    """Step 1: Send verification code to phone via SMS."""

    def post(self, request):
        try:
            data = json.loads(request.body)
            phone = data.get("phone", "").strip().replace(" ", "").replace("-", "")

            if not phone or len(phone) < 10:
                return JsonResponse({"error": "شماره موبایل معتبر نیست"}, status=400)

            # If phone already registered, suggest login
            if Profile.objects.filter(phone=phone).exists():
                return JsonResponse(
                    {"error": "این شماره موبایل قبلاً ثبت شده است. وارد شوید."},
                    status=400,
                )

            result = send_code(phone)
            if result["success"]:
                # Dev mode: return code in response when SMS not configured
                dev_code = None
                from django.core.cache import cache
                stored = cache.get(f"reg_code:{phone}")
                if stored:
                    dev_code = stored["code"]

                return JsonResponse(
                    {
                        "success": True,
                        "message": "کد تایید به موبایل شما ارسال شد",
                        "dev_code": dev_code,
                    }
                )
            return JsonResponse({"error": result.get("error", "خطا")}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({"error": "داده نامعتبر"}, status=400)
        except Exception as e:
            return JsonResponse({"error": f"خطای سرور: {str(e)}"}, status=500)


@method_decorator(csrf_exempt, name="dispatch")
class VerifyCodeView(View):
    """Step 2: Verify the code entered by user."""

    def post(self, request):
        try:
            data = json.loads(request.body)
            phone = data.get("phone", "").strip().replace(" ", "").replace("-", "")
            code = data.get("code", "").strip()

            result = verify_code(phone, code)
            if result["success"]:
                return JsonResponse(
                    {"success": True, "message": "شماره موبایل تایید شد"}
                )
            return JsonResponse({"error": result.get("error", "خطا")}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({"error": "داده نامعتبر"}, status=400)
        except Exception as e:
            return JsonResponse({"error": f"خطای سرور: {str(e)}"}, status=500)


@method_decorator(csrf_exempt, name="dispatch")
class CompleteRegistrationView(View):
    """Step 3: Create account after email verification."""

    def post(self, request):
        try:
            data = json.loads(request.body)
            phone = data.get("phone", "").strip().replace(" ", "").replace("-", "")
            username = data.get("username", "").strip()
            password = data.get("password", "")
            first_name = data.get("first_name", "").strip()
            last_name = data.get("last_name", "").strip()
            email = data.get("email", "").strip().lower()

            # Must be verified first
            if not is_verified(phone):
                return JsonResponse(
                    {"error": "ابتدا شماره موبایل خود را تایید کنید"}, status=400
                )

            if not username or not password or not first_name or not last_name:
                return JsonResponse(
                    {"error": "نام، نام خانوادگی، نام کاربری و رمز عبور الزامی است"},
                    status=400,
                )

            if len(username) < 3:
                return JsonResponse(
                    {"error": "نام کاربری باید حداقل ۳ کاراکتر باشد"}, status=400
                )

            if len(password) < 8:
                return JsonResponse(
                    {"error": "رمز عبور باید حداقل ۸ کاراکتر باشد"}, status=400
                )

            if User.objects.filter(username=username).exists():
                return JsonResponse(
                    {"error": "این نام کاربری قبلاً ثبت شده است"}, status=400
                )

            if not IRAN_PHONE_RE.match(phone):
                return JsonResponse(
                    {"error": "شماره موبایل معتبر نیست (مثال: 09123456789)"},
                    status=400,
                )

            if Profile.objects.filter(phone=phone).exists():
                return JsonResponse(
                    {"error": "این شماره موبایل قبلاً ثبت شده است"}, status=400
                )

            # Create user
            user = User.objects.create_user(
                username=username,
                password=password,
                email=email or f"{username}@mehrcoffenet.com",
                first_name=first_name,
                last_name=last_name,
            )

            Profile.objects.create(user=user, phone=phone)

            clear_verification(phone)
            login(request, user)
            request.session.set_expiry(60 * 60 * 24 * 14)

            # Welcome SMS
            from config.sms import send_sms
            send_sms(phone, f"{first_name} عزیز، خوش آمدید! حساب شما در کافی‌نت مهر ساخته شد.")

            return JsonResponse(
                {"success": True, "user": user_json(user)}, status=201
            )
        except json.JSONDecodeError:
            return JsonResponse({"error": "داده نامعتبر"}, status=400)
