from django.contrib import admin
from .models import Order


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):

    list_display = (
        "tracking_code",
        "customer_name",
        "phone",
        "service",
        "get_price",
        "status",
        "created_at",
    )

    list_filter = (
        "status",
        "service",
        "created_at",
    )

    search_fields = (
        "tracking_code",
        "customer_name",
        "phone",
        "description",
    )

    readonly_fields = (
        "tracking_code",
        "created_at",
    )

    ordering = ("-created_at",)

    list_per_page = 25

    @admin.display(description="مبلغ")
    def get_price(self, obj):
        return f"{obj.service.price:,} تومان"