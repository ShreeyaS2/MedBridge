from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.config import anthropic, supabase
from app.auth import get_user_id
import json

router = APIRouter()

class SymptomRequest(BaseModel):
    symptom: str
    patient_context: str = ""

@router.post("/symptom")
async def check_symptom(req: SymptomRequest, user_id: str = Depends(get_user_id)):
    prompt = f"""You are MedBridge symptom checker. {req.patient_context}
Patient reports: "{req.symptom}"
Classify: SAFE, MONITOR, or URGENT.
Return ONLY JSON: {{"classification":"SAFE"|"MONITOR"|"URGENT","explanation":"2-3 sentences","action":"one sentence"}}"""

    response = anthropic.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=400,
        messages=[{"role": "user", "content": prompt}]
    )
    result = json.loads(response.content[0].text.replace("```json","").replace("```","").strip())

    supabase.table("symptom_logs").insert({
        "user_id": user_id,
        "symptom_text": req.symptom,
        "classification": result["classification"],
        "explanation": result["explanation"]
    }).execute()

    return result