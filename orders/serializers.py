from rest_framework import serializers
from .models import Order


class OrderSerializer(serializers.ModelSerializer):
    service_name = serializers.CharField(
        source="service.name",
        read_only=True
    )

    class Meta:
        model = Order
        fields = [
            "id",
            "tracking_code",
            "customer_name",
            "phone",
            "service",
            "service_name",
            "description",
            "status",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "tracking_code",
            "service_name",
            "status",
            "created_at",
        ]