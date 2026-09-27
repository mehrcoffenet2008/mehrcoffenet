from django.db import models
from services.models import Service


class Order(models.Model):

    STATUS_CHOICES = [
        ("pending", "در انتظار بررسی"),
        ("processing", "در حال انجام"),
        ("completed", "تکمیل شده"),
        ("cancelled", "لغو شده"),
    ]

    tracking_code = models.CharField(
        max_length=20,
        unique=True
    )

    customer_name = models.CharField(max_length=150)
    phone = models.CharField(max_length=20)

    service = models.ForeignKey(
        Service,
        on_delete=models.PROTECT,
        related_name="orders"
    )

    description = models.TextField(blank=True)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.customer_name} - {self.tracking_code}"