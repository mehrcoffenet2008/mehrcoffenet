"""
SMS notification via Kavenegar API.
Get a free API key at: https://kavenegar.com
Set KAVENEGAR_API_KEY in settings or environment.

Uses urllib (stdlib) so no extra dependency is needed.
"""
import json
import os
import logging
import urllib.request
import urllib.parse

from django.conf import settings

logger = logging.getLogger(__name__)

API_KEY = os.environ.get("KAVENEGAR_API_KEY", getattr(settings, "KAVENEGAR_API_KEY", ""))
BASE_URL = "https://api.kavenegar.com/v1"


def send_sms(phone: str, message: str) -> bool:
    """Send a single SMS. Returns True on success, False otherwise.

    Never raises — SMS failure must not break the main flow.
    """
    if not API_KEY:
        logger.info("KAVENEGAR_API_KEY not set — skipping SMS to %s", phone)
        return False

    if not phone:
        return False

    try:
        data = urllib.parse.urlencode(
            {"receptor": phone, "message": message}
        ).encode("utf-8")

        req = urllib.request.Request(
            f"{BASE_URL}/{API_KEY}/sms/send.json",
            data=data,
            method="POST",
        )

        with urllib.request.urlopen(req, timeout=10) as resp:
            if resp.status == 200:
                return True
            logger.warning("SMS failed (%s)", resp.status)
            return False
    except Exception as exc:
        logger.warning("SMS error: %s", exc)
        return False


def notify_order_created(phone: str, tracking_code: str, service_name: str) -> bool:
    message = (
        f"کافی‌نت مهر\n"
        f"سفارش شما ثبت شد.\n"
        f"خدمت: {service_name}\n"
        f"کد پیگیری: {tracking_code}\n"
        f"برای پیگیری به سایت مراجعه کنید."
    )
    return send_sms(phone, message)


def notify_order_status(phone: str, tracking_code: str, status_label: str) -> bool:
    message = (
        f"کافی‌نت مهر\n"
        f"وضعیت سفارش {tracking_code} تغییر کرد.\n"
        f"وضعیت جدید: {status_label}"
    )
    return send_sms(phone, message)


def notify_welcome(phone: str, first_name: str) -> bool:
    message = (
        f"کافی‌نت مهر\n"
        f"{first_name} عزیز، خوش آمدید!\n"
        f"حساب شما با موفقیت ساخته شد."
    )
    return send_sms(phone, message)
