"""Sends the generated invitation by email over SMTP.

Deliberately plain smtplib/email (stdlib) rather than a provider SDK, so
this works with any SMTP account (Gmail app password, SendGrid SMTP relay,
a personal mail server, ...) without an extra dependency per provider.
Nothing here is invoked unless Config.is_email_configured is true --
see app.py's /api/send-invitation route.
"""

from __future__ import annotations

import logging
import smtplib
from email.message import EmailMessage

from .config import Config


class EmailSendError(RuntimeError):
    """Raised when the SMTP server rejects or fails to send the message."""


def send_invitation_email(
    config: Config,
    *,
    to_email: str,
    host_name: str,
    dinner_title: str,
    letter_text: str,
    logger: logging.Logger,
) -> None:
    if not config.is_email_configured:
        raise RuntimeError("send_invitation_email called without SMTP configured; check is_email_configured first")

    subject = f"{dinner_title or '生死晚餐 Death Over Dinner'} — {host_name}".strip(" —")

    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = f"{config.smtp_from_name} <{config.smtp_from_email}>"
    message["To"] = to_email
    message.set_content(letter_text)

    try:
        with smtplib.SMTP(config.smtp_host, config.smtp_port, timeout=15) as smtp:
            smtp.starttls()
            smtp.login(config.smtp_user, config.smtp_password)
            smtp.send_message(message)
    except (smtplib.SMTPException, OSError) as exc:
        logger.error("Failed to send invitation email to %s: %s", to_email, exc)
        raise EmailSendError(str(exc)) from exc
