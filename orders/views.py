from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action

from .models import Order
from .serializers import OrderSerializer

import uuid


class OrderViewSet(viewsets.ModelViewSet):

    queryset = Order.objects.all().order_by("-created_at")
    serializer_class = OrderSerializer


    def perform_create(self, serializer):
        tracking_code = uuid.uuid4().hex[:10].upper()

        serializer.save(
            tracking_code=tracking_code
        )


    @action(
        detail=False,
        methods=["get"],
        url_path=r"track/(?P<tracking_code>[^/.]+)"
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