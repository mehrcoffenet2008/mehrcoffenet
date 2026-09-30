"""
Email notifications for orders and account events.

Configure SMTP via environment variables:
  EMAIL_HOST       e.g. smtp.gmail.com
  EMAIL_PORT       e.g. 587
  EMAIL_HOST_USER  your email
  EMAIL_HOST_PASSWORD  app password (Gmail: App Passwords)
  DEFAULT_FROM_EMAIL

Without SMTP config, emails print to console (local dev).
"""
import logging

from django.conf import settings
from django.core.mail import send_mail

logger = logging.getLogger(__name__)

BRAND = "کافی‌نت مهر"


def _send(to_email: str, subject: str, body: str) -> bool:
    """Send an email. Never raises — failure must not break the main flow."""
    if not to_email:
        return False

    try:
        send_mail(
            subject=f"[{BRAND}] {subject}",
            message=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[to_email],
            fail_silently=True,
        )
        return True
    except Exception as exc:
        logger.warning("Email error: %s", exc)
        return False


def notify_welcome(email: str, first_name: str) -> bool:
    body = (
        f"{first_name} عزیز،\n\n"
        f"خوش آمدید! حساب شما در {BRAND} با موفقیت ساخته شد.\n\n"
        f"با ورود به حساب خود می‌توانید سفارش ثبت کنید و سفارشات خود را پیگیری کنید.\n\n"
        f"با احترام،\n{BRAND}"
    )
    return _send(email, "خوش آمدید", body)


def send_verification_code(email: str, code: str) -> bool:
    body = (
        f"کد تایید شما در {BRAND}:\n\n"
        f"{code}\n\n"
        f"این کد به مدت ۱۰ دقیقه معتبر است.\n"
        f"اگر شما این درخواست را نداده‌اید، این ایمیل را نادیده بگیرید.\n\n"
        f"با احترام،\n{BRAND}"
    )
    return _send(email, f"کد تایید {BRAND}", body)


def notify_order_created(email: str, tracking_code: str, service_name: str) -> bool:
    body = (
        f"سفارش شما با موفقیت ثبت شد.\n\n"
        f"خدمت: {service_name}\n"
        f"کد پیگیری: {tracking_code}\n\n"
        f"برای پیگیری وضعیت سفارش، به بخش «پیگیری درخواست» سایت مراجعه کنید.\n\n"
        f"با احترام،\n{BRAND}"
    )
    return _send(email, f"ثبت سفارش — کد پیگیری {tracking_code}", body)


def notify_order_status(email: str, tracking_code: str, status_label: str) -> bool:
    body = (
        f"وضعیت سفارش شما تغییر کرد.\n\n"
        f"کد پیگیری: {tracking_code}\n"
        f"وضعیت جدید: {status_label}\n\n"
        f"با احترام،\n{BRAND}"
    )
    return _send(email, f"تغییر وضعیت سفارش {tracking_code}", body)
