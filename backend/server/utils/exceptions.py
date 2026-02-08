from rest_framework.views import exception_handler
from rest_framework.response import Response
from server import settings


def api_exception_handler(exception, context):
    response = exception_handler(exception, context)

    if response is not None:
        response.data = {
            "success": False,
            "errors": response.data if response.data is not None else {},
        }
        return response

    if settings.DEBUG == True:
        raise exception

    return Response(
        data={
            "success": False,
            "errors": {
                "detail": "Internal Server Error",
            },
        },
        status=500,
    )
