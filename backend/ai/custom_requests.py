from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
import requests
from dotenv import load_dotenv

load_dotenv()
router = APIRouter()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

class CustomRequest(BaseModel):
    reciever_id: str
    quantity: str
    food_type: str
    required_by: str
    notes: str

@router.post("/submit_custom_request")
async def submit_custom_request(payload: CustomRequest):
    try:
        response = requests.post(
            f"{SUPABASE_URL}/rest/v1/custom_requests",
            headers={
                "apikey": SUPABASE_SERVICE_KEY,
                "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
                "Content-Type": "application/json",
                "Prefer": "return=representation"
            },
            json=payload.dict()
        )

        if response.status_code != 201:
            print("Supabase insert error:", response.text)
            raise HTTPException(status_code=400, detail="Request submission failed")

        return {"message": "Request submitted successfully!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
