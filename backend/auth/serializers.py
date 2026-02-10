from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
    TokenRefreshSerializer,
)
from rest_framework import serializers
from account.models import Account


class _AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = [
            "id",
            "first_name",
            "last_name",
            "role",
        ]
        read_only_fields = fields


class AuthTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        validated_attrs = super().validate(attrs)

        return {
            "token": {
                "access": validated_attrs["access"],
                "refresh": validated_attrs["refresh"],
            },
            "account": _AccountSerializer(self.user).data,
        }
