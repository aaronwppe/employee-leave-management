from django.contrib.auth.tokens import PasswordResetTokenGenerator
from rest_framework import serializers
from account.models import Account


class AuthPasswordResetSerializer(serializers.Serializer):
    account_id = serializers.PrimaryKeyRelatedField(
        queryset=Account.objects.all(),
        source="account",
        write_only=True,
    )
    token = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        account = attrs["account"]
        token = attrs["token"]

        token_generator = PasswordResetTokenGenerator()

        if not token_generator.check_token(account, token):
            raise serializers.ValidationError("Token has expired.")

        return attrs

    def save(self, **kwargs):
        account = self.validated_data["account"]
        password = self.validated_data["password"]

        account.set_password(password)
        account.save()

        return account
