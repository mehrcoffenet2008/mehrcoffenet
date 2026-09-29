from django.conf import settings
from django.http import FileResponse
from django.views import View
from pathlib import Path


class FrontendView(View):
    """Serve the frontend index.html for all non-API routes (SPA routing)."""

    def get(self, request, *args, **kwargs):
        index_path = Path(settings.FRONTEND_DIST) / "index.html"
        if index_path.exists():
            return FileResponse(open(index_path, "rb"))
        from django.http import HttpResponseNotFound
        return HttpResponseNotFound("Frontend not built. Run: cd frontend && npm run build")
