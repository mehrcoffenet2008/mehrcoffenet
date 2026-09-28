from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status


@action(
    detail=False,
    methods=["get"],
    url_path="track/(?P<tracking_code>[^/.]+)"
)
def track_order(self, request, tracking_code=None):

    try:
        order = self.get_queryset().get(
            tracking_code=tracking_code
        )
    except Order.DoesNotExist:
        return Response(
            {"detail": "درخواستی با این کد پیگیری پیدا نشد."},
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = self.get_serializer(order)

    return Response(serializer.data)