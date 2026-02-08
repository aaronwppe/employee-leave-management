from rest_framework import pagination
from rest_framework.response import Response


class ApiLimitOffsetPagination(pagination.LimitOffsetPagination):
    def get_paginated_response(self, data):
        total_count_key = getattr(self, "total_count_key", "total_count")
        results_key = getattr(self, "results_key", "results")

        return Response({total_count_key: self.count, results_key: data})
