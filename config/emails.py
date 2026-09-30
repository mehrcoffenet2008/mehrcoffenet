"""
Email notifications for orders and account events.

Uses Mailgun API (no SMTP connection required).
Fallback to console if no API key configured.

Required env vars:
  MAILGUN_API_KEY   e.g. key-xxxxx
  MAILGUN_DOMAIN    e.g. mg.mehrcoffenet.com
"""
import logging
import urllib.request
import urllib.parse
import json
import base64

from django.conf import settings

logger = logging.getLogger(__name__)

BRAND = "کافی‌نت مهر"


def _send_via_mailgun(to_email: str, subject: str, body: str, html_body: str = None) -> bool:
    """Send email via Mailgun API. Returns True on success."""
    api_key = getattr(settings, "MAILGUN_API_KEY", "")
    domain = getattr(settings, "MAILGUN_DOMAIN", "")
    if not api_key or not domain:
        return False

    from_email = settings.DEFAULT_FROM_EMAIL

    data = {
        "from": f"{BRAND} <{from_email}>",
        "to": to_email,
        "subject": f"[{BRAND}] {subject}",
        "text": body,
    }

    if html_body:
        data["html"] = html_body

    encoded_data = urllib.parse.urlencode(data).encode("utf-8")
    
    credentials = base64.b64encode(f"api:{api_key}".encode()).decode()
    
    req = urllib.request.Request(
        f"https://api.mailgun.net/v3/{domain}/messages",
        data=encoded_data,
        headers={
            "Authorization": f"Basic {credentials}",
            "Content-Type": "application/x-www-form-urlencoded",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return 200 <= resp.status < 300
    except Exception as exc:
        logger.warning("Mailgun error: %s", exc)
        return False


def _send(to_email: str, subject: str, body: str, html_body: str = None) -> bool:
    """Send an email. Never raises — failure must not break the main flow."""
    if not to_email:
        return False

    # Try Mailgun first
    if _send_via_mailgun(to_email, subject, body, html_body):
        return True

    # Fallback: log to console
    logger.info("Email to %s: %s\n%s", to_email, subject, body)
    print(f"\n{'='*40}\nEmail to: {to_email}\nSubject: {subject}\n{body}\n{'='*40}\n")
    return False


def _html_template(title: str, content: str) -> str:
    """Simple HTML email template."""
    return f"""
    <div style="direction: rtl; font-family: Tahoma, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9;">
        <div style="background: #0a0a0a; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: #c9a96e; margin: 0; font-size: 24px;">{BRAND}</h1>
        </div>
        <div style="background: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0; border-top: none;">
            <h2 style="color: #0a0a0a; margin-top: 0;">{title}</h2>
            <div style="color: #333; line-height: 1.8; font-size: 14px;">
                {content}
            </div>
        </div>
        <div style="text-align: center; padding: 15px; color: #999; font-size: 12px;">
            <p>این ایمیل به صورت خودکار ارسال شده است.</p>
            <p>© 2026 {BRAND}</p>
        </div>
    </div>
    """


def notify_welcome(email: str, first_name: str) -> bool:
    body = (
        f"{first_name} عزیز،\n\n"
        f"خوش آمدید! حساب شما در {BRAND} با موفقیت ساخته شد.\n\n"
        f"با ورود به حساب خود می‌توانید سفارش ثبت کنید و سفارشات خود را پیگیری کنید.\n\n"
        f"با احترام،\n{BRAND}"
    )
    html = _html_template(
        "خوش آمدید",
        f"""
        <p>{first_name} عزیز،</p>
        <p>خوش آمدید! حساب شما در <strong>{BRAND}</strong> با موفقیت ساخته شد.</p>
        <p>با ورود به حساب خود می‌توانید سفارش ثبت کنید و سفارشات خود را پیگیری کنید.</p>
        """
    )
    return _send(email, "خوش آمدید", body, html)


def send_verification_code(email: str, code: str) -> bool:
    body = (
        f"کد تایید شما در {BRAND}:\n\n"
        f"{code}\n\n"
        f"این کد به مدت ۱۰ دقیقه معتبر است.\n"
        f"اگر شما این درخواست را نداده‌اید، این ایمیل را نادیده بگیرید.\n\n"
        f"با احترام،\n{BRAND}"
    )
    html = _html_template(
        "کد تایید",
        f"""
        <p>کد تایید شما در <strong>{BRAND}</strong>:</p>
        <div style="background: #f0f0f0; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #0a0a0a;">{code}</span>
        </div>
        <p>این کد به مدت <strong>۱۰ دقیقه</strong> معتبر است.</p>
        <p style="color: #666; font-size: 12px;">اگر شما این درخواست را نداده‌اید، این ایمیل را نادیده بگیرید.</p>
        """
    )
    return _send(email, f"کد تایید {BRAND}", body, html)


def notify_order_created(email: str, tracking_code: str, service_name: str) -> bool:
    body = (
        f"سفارش شما با موفقیت ثبت شد.\n\n"
        f"خدمت: {service_name}\n"
        f"کد پیگیری: {tracking_code}\n\n"
        f"برای پیگیری وضعیت سفارش، به بخش «پیگیری درخواست» سایت مراجعه کنید.\n\n"
        f"با احترام،\n{BRAND}"
    )
    html = _html_template(
        "ثبت سفارش",
        f"""
        <p>سفارش شما با موفقیت ثبت شد.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
                <td style="padding: 10px; border: 1px solid #e0e0e0; background: #f9f9f9;"><strong>خدمت</strong></td>
                <td style="padding: 10px; border: 1px solid #e0e0e0;">{service_name}</td>
            </tr>
            <tr>
                <td style="padding: 10px; border: 1px solid #e0e0e0; background: #f9f9f9;"><strong>کد پیگیری</strong></td>
                <td style="padding: 10px; border: 1px solid #e0e0e0; font-family: monospace; font-size: 16px;">{tracking_code}</td>
            </tr>
        </table>
        <p>برای پیگیری وضعیت سفارش، به بخش «پیگیری درخواست» سایت مراجعه کنید.</p>
        """
    )
    return _send(email, f"ثبت سفارش — کد پیگیری {tracking_code}", body, html)


def notify_order_status(email: str, tracking_code: str, status_label: str) -> bool:
    body = (
        f"وضعیت سفارش شما تغییر کرد.\n\n"
        f"کد پیگیری: {tracking_code}\n"
        f"وضعیت جدید: {status_label}\n\n"
        f"با احترام،\n{BRAND}"
    )
    html = _html_template(
        "تغییر وضعیت سفارش",
        f"""
        <p>وضعیت سفارش شما تغییر کرد.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
                <td style="padding: 10px; border: 1px solid #e0e0e0; background: #f9f9f9;"><strong>کد پیگیری</strong></td>
                <td style="padding: 10px; border: 1px solid #e0e0e0; font-family: monospace;">{tracking_code}</td>
            </tr>
            <tr>
                <td style="padding: 10px; border: 1px solid #e0e0e0; background: #f9f9f9;"><strong>وضعیت جدید</strong></td>
                <td style="padding: 10px; border: 1px solid #e0e0e0;">{status_label}</td>
            </tr>
        </table>
        """
    )
    return _send(email, f"تغییر وضعیت سفارش {tracking_code}", body, html)
