"""
SMS notifications via sms.ir API.

Required env var:
  SMS_IR_API_KEY  e.g. qQbekVmGc3kVAmmUQBeIfhyt851hqfAd7b2f7B3bDnThRJod
"""
import logging
import urllib.request
import json

from django.conf import settings

logger = logging.getLogger(__name__)

SMS_IR_API_KEY = getattr(settings, "SMS_IR_API_KEY", "")


def send_sms(phone: str, message: str) -> bool:
    """Send SMS via sms.ir API. Returns True on success."""
    if not SMS_IR_API_KEY:
        logger.warning("SMS_IR_API_KEY not configured")
        return False

    if not phone or not message:
        return False

    # Normalize phone number
    phone = phone.strip().replace(" ", "").replace("-", "")
    if phone.startswith("0"):
        phone = "98" + phone[1:]
    elif phone.startswith("+"):
        phone = phone[1:]

    url = "https://api.sms.ir/v1/send/simple"

    payload = {
        "mobile": phone,
        "message": message,
    }

    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        headers={
            "Authorization": f"Bearer {SMS_IR_API_KEY}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            result = json.loads(resp.read().decode())
            if result.get("status") == 1 or result.get("code") == 1:
                return True
            logger.warning("SMS error: %s", result)
            return False
    except Exception as exc:
        logger.warning("SMS error: %s", exc)
        return False


def send_verification_code(phone: str, code: str) -> bool:
    """Send verification code via SMS."""
    message = f"کد تایید شما در کافی‌نت مهر:\n\n{code}\n\nاین کد به مدت ۱۰ دقیقه معتبر است."
    return send_sms(phone, message)


def send_order_notification(phone: str, tracking_code: str, service_name: str) -> bool:
    """Send order notification via SMS."""
    message = (
        f"سفارش شما در کافی‌نت مهر ثبت شد.\n\n"
        f"خدمت: {service_name}\n"
        f"کد پیگیری: {tracking_code}"
    )
    return send_sms(phone, message)


def send_status_notification(phone: str, tracking_code: str, status_label: str) -> bool:
    """Send order status notification via SMS."""
    message = (
        f"وضعیت سفارش شما در کافی‌نت مهر تغییر کرد.\n\n"
        f"کد پیگیری: {tracking_code}\n"
        f"وضعیت جدید: {status_label}"
    )
    return send_sms(phone, message)
