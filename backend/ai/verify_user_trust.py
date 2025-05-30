from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import requests
import google.generativeai as genai

# Load environment variables
load_dotenv()

router = APIRouter()

# Load API keys
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

# AI-Based User Registration
class UserRegistration(BaseModel):
    name: str
    email: str
    password: str
    role: str
    org_name: str
    org_type: str
    location: str
    description: str
    doc_url: str
    contact_info: str

@router.post("/register_user_with_ai")
async def register_user_with_ai(payload: UserRegistration):
    prompt = f"""
You are an AI verification agent. Based on the organization details, assign a trust level:
- green: very trustworthy and established
- yellow: moderately trustworthy
- red: lacks trust or unclear

Organization:
- Name: {payload.org_name}
- Type: {payload.org_type}
- Location: {payload.location}
- Description: {payload.description}
- Docs: {payload.doc_url}

Only respond with one word: green, yellow, or red.
"""

    try:
        response = model.generate_content(prompt)
        trust_level = response.text.strip().lower()
        if trust_level not in ["green", "yellow", "red"]:
            trust_level = "yellow"
    except Exception as e:
        print("Gemini Error:", str(e))
        trust_level = "yellow"

    try:
        auth_res = requests.post(
            f"{SUPABASE_URL}/auth/v1/admin/users",
            headers={
                "apikey": SUPABASE_SERVICE_KEY,
                "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}"
            },
            json={
                "email": payload.email,
                "password": payload.password,
                "email_confirm": True
            }
        )

        if auth_res.status_code != 200:
            print("Supabase Auth Error:", auth_res.text)
            raise HTTPException(status_code=500, detail="Supabase Auth registration failed")

        user_id = auth_res.json().get("id")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Auth error: {str(e)}")

    try:
        insert_res = requests.post(
            f"{SUPABASE_URL}/rest/v1/Users",
            headers={
                "apikey": SUPABASE_SERVICE_KEY,
                "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
                "Content-Type": "application/json",
                "Prefer": "return=representation"
            },
            json={
                "id": user_id,
                "name": payload.name,
                "email": payload.email,
                "role": payload.role,
                "org_name": payload.org_name,
                "org_type": payload.org_type,
                "location": payload.location,
                "description": payload.description,
                "doc_url": payload.doc_url,
                "trust_level": trust_level,
                "is_verified": True,
                "verification_st": "approved",
                "contact_info": payload.contact_info
            }
        )

        if insert_res.status_code != 201:
            print("Supabase Insert Error:", insert_res.text)
            raise HTTPException(status_code=500, detail="User metadata insert failed")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Metadata insert error: {str(e)}")

    return {
        "message": "Registered and verified",
        "trust_level": trust_level,
        "user_id": user_id
    }

 #2. Custom Request Submission 
class CustomRequest(BaseModel):
    reciever_id: str
    quantity: str
    food_type: str
    required_by: str
    notes: str

@router.post("/submit_custom_request")
async def submit_custom_request(payload: CustomRequest):
    try:
        res = requests.post(
            f"{SUPABASE_URL}/rest/v1/custom_requests",
            headers={
                "apikey": SUPABASE_SERVICE_KEY,
                "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
                "Content-Type": "application/json",
                "Prefer": "return=representation"
            },
            json={
                "reciever_id": payload.reciever_id,
                "quantity": payload.quantity,
                "food_type": payload.food_type,
                "required_by": payload.required_by,
                "notes": payload.notes,
            }
        )

        if res.status_code != 201:
            print("Supabase Insert Error:", res.text)
            raise HTTPException(status_code=500, detail="Request submission failed")

        return {"message": "Custom request submitted successfully!"}
    
    except Exception as e:
        print("Error:", str(e))
        raise HTTPException(status_code=500, detail="Something went wrong")
