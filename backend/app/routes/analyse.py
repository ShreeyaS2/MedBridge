from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.config import anthropic, supabase
from app.auth import get_user_id
import json

router = APIRouter()

class AnalyseRequest(BaseModel):
    text: str
    language: str = "en"

@router.post("/analyse")
async def analyse(req: AnalyseRequest, user_id: str = Depends(get_user_id)):
    lang_map = {
        "en": "Respond entirely in English.",
        "ta": "Respond with English headings and Tamil (தமிழ்) explanations.",
        "hi": "Respond with English headings and Hindi (Devanagari) explanations."
    }
    prompt = f"""You are MedBridge. Explain this discharge summary simply for a non-medical patient.
{lang_map.get(req.language, lang_map['en'])}
Return ONLY JSON: {{"what_happened":"...","home_care":"...","warning_signs":"...","follow_up":"..."}}
Discharge summary: {req.text}"""

    response = anthropic.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1000,
        messages=[{"role": "user", "content": prompt}]
    )
    result = json.loads(response.content[0].text.replace("```json","").replace("```","").strip())

    supabase.table("discharge_analyses").insert({
        "user_id": user_id,
        "original_text": req.text,
        "language": req.language,
        **result
    }).execute()

    return result