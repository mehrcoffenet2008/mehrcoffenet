from django.contrib import admin

from .models import Service


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):

    list_display = (
        "name",
        "price_display",
        "is_active",
        "created_at",
    )

    list_filter = (
        "is_active",
        "created_at",
    )

    search_fields = (
        "name",
        "description",
    )

    ordering = (
        "-created_at",
    )

    list_per_page = 25

    @admin.display(description="قیمت")
    def price_display(self, obj):
        return f"{obj.price:,} تومان"