class ApiResponseMixin:
    def finalize_response(self, request, response, *args, **kwargs):
        if not isinstance(response.data, dict) or response.data.get("success") is None:
            response.data = {
                "success": True,
                "data": response.data if response.data is not None else {},
            }

        return super().finalize_response(request, response, *args, **kwargs)
