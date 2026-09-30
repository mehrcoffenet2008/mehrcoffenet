"""
Email verification code system for registration.

Flow:
1. User enters email → send_code() generates 6-digit code, emails it
2. User enters code + profile → verify_code() checks and creates account

Codes stored in Django cache with 10-minute expiry.
"""
import logging
import random

from django.core.cache import cache

logger = logging.getLogger(__name__)

CODE_TTL = 60 * 10  # 10 minutes
MAX_ATTEMPTS = 5


def generate_code() -> str:
    return str(random.randint(100000, 999999))


def send_code(email: str) -> dict:
    """Generate and email a verification code. Returns {success, error?}."""
    if not email or "@" not in email:
        return {"success": False, "error": "ایمیل معتبر نیست"}

    code = generate_code()
    cache.set(f"reg_code:{email}", {"code": code, "attempts": 0}, CODE_TTL)

    from config.emails import send_verification_code
    sent = send_verification_code(email, code)

    if not sent:
        # Fallback: log the code so it's visible in console (dev mode)
        logger.info("Verification code for %s: %s", email, code)
        print(f"\n{'='*40}\nکد تایید برای {email}: {code}\n{'='*40}\n")

    return {"success": True}


def verify_code(email: str, code: str) -> dict:
    """Check verification code. Returns {success, error?}."""
    if not email or not code:
        return {"success": False, "error": "ایمیل و کد تایید الزامی است"}

    stored = cache.get(f"reg_code:{email}")
    if not stored:
        return {"success": False, "error": "کد تایید منقضی شده است. دوباره درخواست بدهید."}

    if stored["attempts"] >= MAX_ATTEMPTS:
        cache.delete(f"reg_code:{email}")
        return {"success": False, "error": "تلاش‌های زیادی ناموفق بود. دوباره کد درخواست کنید."}

    if stored["code"] != code.strip():
        stored["attempts"] += 1
        cache.set(f"reg_code:{email}", stored, CODE_TTL)
        remaining = MAX_ATTEMPTS - stored["attempts"]
        return {"success": False, "error": f"کد اشتباه است ({remaining} تلاش باقی مانده)"}

    # Code verified — keep it for the final registration step
    cache.set(f"reg_verified:{email}", True, CODE_TTL)
    cache.delete(f"reg_code:{email}")
    return {"success": True}


def is_verified(email: str) -> bool:
    return bool(cache.get(f"reg_verified:{email}"))


def clear_verification(email: str):
    cache.delete(f"reg_verified:{email}")
