from rest_framework.authentication import SessionAuthentication


class CsrfExemptSessionAuthentication(SessionAuthentication):
    """Session auth without CSRF enforcement (for API calls from same origin)."""

    def enforce_csrf(self, request):
        return  # skip CSRF check
