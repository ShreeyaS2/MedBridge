from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.config import anthropic
from app.auth import get_user_id
import json

router = APIRouter()

class DrugRequest(BaseModel):
    drug_name: str

@router.post("/drug")
async def drug_lookup(req: DrugRequest, user_id: str = Depends(get_user_id)):
    prompt = f"""You are a pharmacist for MedBridge. Patient looked up "{req.drug_name}".
Return ONLY JSON:
{{"generic_name":"...","what_for":"...","how_to_take":"...","side_effects":"...","avoid":"..."}}"""

    response = anthropic.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=600,
        messages=[{"role": "user", "content": prompt}]
    )
    return json.loads(response.content[0].text.replace("```json","").replace("```","").strip())