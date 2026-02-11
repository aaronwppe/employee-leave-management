from django.core.mail import EmailMultiAlternatives
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.template.loader import render_to_string
from account.models import Account
from server.settings import RESET_PASSWORD_URL
from urllib.parse import urlencode


def _get_password_reset_link(account: Account) -> str:
    token_generator = PasswordResetTokenGenerator()
    token = token_generator.make_token(account)
    query_params = urlencode(
        {
            "account_id": account.id,
            "token": token,
        }
    )
    return f"{RESET_PASSWORD_URL}?{query_params}"


def send_activation_email(
    account: Account,
) -> None:
    reset_link = _get_password_reset_link(account)

    email = EmailMultiAlternatives(
        subject="ELMS Account Setup",
        body=f"Your ELMS Account has been activated.\Please proceed to Setup your Account here {reset_link}.",
        from_email=None,
        to=[account.email],
    )

    html_content = render_to_string(
        "activation_email.html",
        {
            "name": account.first_name,
            "reset_password_link": reset_link,
        },
    )

    email.attach_alternative(
        content=html_content,
        mimetype="text/html",
    )

    email.send(fail_silently=False)
