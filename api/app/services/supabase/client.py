import os
from dotenv import load_dotenv
from supabase import Client, create_client

load_dotenv()

url = os.getenv("SUPABASE_URL") or ""
key = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or ""
supabase_client: Client = create_client(url, key)
