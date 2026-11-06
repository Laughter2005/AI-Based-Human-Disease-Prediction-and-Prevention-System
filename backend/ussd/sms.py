"""SMS sending via Africa's Talking SDK."""
from __future__ import annotations

import africastalking
from config import get_settings

settings = get_settings()

# Safely try to initialize the SDK
_sms = None
try:
    if settings.at_api_key and settings.at_username:
        africastalking.initialize(settings.at_username, settings.at_api_key)
        _sms = africastalking.SMS
        print("[SMS] Africa's Talking SDK initialized successfully.")
    else:
        print("[SMS] Warning: AT_API_KEY or AT_USERNAME is missing in .env")
except Exception as e:
    print(f"[SMS] Error initializing Africa's Talking SDK: {e}")

def send_prediction_sms(phone: str, message: str) -> bool:
    """Send the prediction result by SMS. Returns True on success."""
    print(f"[SMS] Attempting to send to: {phone}")
    
    if not _sms:
        print("[SMS] Error: SDK not initialized. Cannot send.")
        return False

    try:
        sender = settings.at_sender_id or None
        response = _sms.send(message, [phone], sender_id=sender)
        print(f"[SMS] AT Response: {response}")
        
        recipients = response.get("SMSMessageData", {}).get("Recipients", [])
        return any(r.get("status") == "Success" for r in recipients)
    except Exception as e:
        print(f"[SMS] Exception during send: {e}")
        return False