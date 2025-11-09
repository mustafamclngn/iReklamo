import os
import smtplib
import ssl
from email.message import EmailMessage
from pathlib import Path

TEMPLATE_DIR = Path(__file__).resolve().parents[1] / 'templates'
LOG_FILE = Path(__file__).resolve().parents[2] / 'sent_emails.log'


def _load_template(template_name: str) -> str:
    tpl_path = TEMPLATE_DIR / template_name
    if not tpl_path.exists():
        return ''
    return tpl_path.read_text(encoding='utf-8')


def send_email(to_email: str, subject: str, text_body: str = '', html_template: str = None, context: dict = None) -> tuple:
    """
    Send email using SMTP credentials from environment. If MAIL_USERNAME/PASSWORD are not set,
    fall back to writing the email to `sent_emails.log` and printing a warning.

    Returns (True, None) on success or (False, error_message) on failure.
    """
    context = context or {}

    mail_server = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
    mail_port = int(os.getenv('MAIL_PORT', 587))
    mail_use_tls = os.getenv('MAIL_USE_TLS', 'True').lower() in ('1', 'true', 'yes')
    mail_user = os.getenv('MAIL_USERNAME')
    mail_pass = os.getenv('MAIL_PASSWORD')
    default_sender = os.getenv('MAIL_DEFAULT_SENDER') or mail_user

    # Prepare message
    msg = EmailMessage()
    msg['Subject'] = subject
    msg['From'] = default_sender
    msg['To'] = to_email

    # Render HTML if template provided
    html_content = ''
    if html_template:
        tpl = _load_template(html_template)
        try:
            html_content = tpl.format(**context)
        except Exception:
            # fallback: try simple replace
            html_content = tpl

    # Set both plain and html bodies
    if html_content:
        msg.set_content(text_body or 'Please view this message in an HTML-capable client.')
        msg.add_alternative(html_content, subtype='html')
    else:
        msg.set_content(text_body)

    # If credentials missing, write to log and return success (dev fallback)
    if not mail_user or not mail_pass:
        try:
            LOG_FILE.parent.mkdir(parents=True, exist_ok=True)
            with LOG_FILE.open('a', encoding='utf-8') as f:
                f.write('---\n')
                f.write(f'To: {to_email}\n')
                f.write(f'Subject: {subject}\n')
                f.write('Body:\n')
                f.write(text_body + '\n')
                if html_content:
                    f.write('HTML:\n')
                    f.write(html_content + '\n')
            print(f"DEV MODE: Email written to {LOG_FILE}. To actually send, set MAIL_USERNAME and MAIL_PASSWORD in your environment.")
            return True, None
        except Exception as e:
            return False, f"Failed to write email to log: {e}"

    # Send via SMTP
    try:
        context_ssl = ssl.create_default_context()
        with smtplib.SMTP(mail_server, mail_port) as server:
            if mail_use_tls:
                server.starttls(context=context_ssl)
            server.login(mail_user, mail_pass)
            server.send_message(msg)
        return True, None
    except Exception as e:
        # Log failure
        print('Error sending email:', e)
        return False, str(e)
