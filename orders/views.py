from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny

from .models import Order
from .serializers import OrderSerializer
from config.sms import notify_order_created, notify_order_status

import uuid


class OrderViewSet(viewsets.ModelViewSet):

    queryset = Order.objects.all().order_by("-created_at")
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Order.objects.all().order_by("-created_at")
        return Order.objects.filter(user=user).order_by("-created_at")

    def perform_create(self, serializer):
        tracking_code = uuid.uuid4().hex[:10].upper()

        order = serializer.save(
            tracking_code=tracking_code,
            user=self.request.user
        )

        # SMS notification (never blocks the response)
        notify_order_created(
            order.phone,
            tracking_code,
            order.service.name,
        )

    def perform_update(self, serializer):
        order = serializer.save()
        status_labels = dict(Order.STATUS_CHOICES)
        notify_order_status(
            order.phone,
            order.tracking_code,
            status_labels.get(order.status, order.status),
        )


    def perform_create(self, serializer):
        tracking_code = uuid.uuid4().hex[:10].upper()

        serializer.save(
            tracking_code=tracking_code,
            user=self.request.user
        )


    @action(
        detail=False,
        methods=["get"],
        url_path=r"track/(?P<tracking_code>[^/.]+)",
        permission_classes=[AllowAny]
    )
    def track(self, request, tracking_code=None):

        try:
            order = Order.objects.get(
                tracking_code=tracking_code.upper()
            )

        except Order.DoesNotExist:
            return Response(
                {
                    "detail": "درخواستی با این کد پیگیری پیدا نشد."
                },
                status=status.HTTP_404_NOT_FOUND
            )


        serializer = self.get_serializer(order)

        return Response(serializer.data)