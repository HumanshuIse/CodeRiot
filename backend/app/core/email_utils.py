# app/core/email_utils.py

import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

# Load SMTP configuration from environment variables
SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = int(os.getenv("SMTP_PORT"))
SMTP_USERNAME = os.getenv("SMTP_USERNAME")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")

def send_email(recipient_email: str, subject: str, body: str):
    """
    Sends an email using the configured SMTP server.
    """
    if not all([SMTP_SERVER, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD]):
        print("SMTP settings are not fully configured. Skipping email.")
        return

    try:
        # Create the email message
        message = MIMEMultipart()
        message["From"] = SMTP_USERNAME
        message["To"] = recipient_email
        message["Subject"] = subject
        message.attach(MIMEText(body, "plain"))

        # Connect to the SMTP server and send the email
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()  # Secure the connection
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.sendmail(SMTP_USERNAME, recipient_email, message.as_string())
            print(f"Email successfully sent to {recipient_email}")

    except Exception as e:
        # It's good practice to log errors instead of just printing
        print(f"Failed to send email to {recipient_email}. Error: {e}")