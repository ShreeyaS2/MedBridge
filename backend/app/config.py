import os
from pathlib import Path
from dotenv import load_dotenv
from anthropic import Anthropic
from supabase import create_client
from twilio.rest import Client as TwilioClient

load_dotenv()

anthropic = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
supabase  = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_SERVICE_KEY"))

# Only init Twilio if keys exist
twilio_sid   = os.getenv("TWILIO_ACCOUNT_SID")
twilio_token = os.getenv("TWILIO_AUTH_TOKEN")
twilio = TwilioClient(twilio_sid, twilio_token) if twilio_sid and twilio_token else None