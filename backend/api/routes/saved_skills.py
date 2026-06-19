"""Saved skills endpoints — bookmark skills per user."""
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from backend.api.deps import get_db
from backend.db.models import SavedSkill

router = APIRouter()


class SaveRequest(BaseModel):
    user_id: str
    skill_name: str


@router.get("/{user_id}")
def get_saved_skills(user_id: str, db: Session = Depends(get_db)):
    saved = db.query(SavedSkill).filter_by(user_id=user_id).all()
    return [{"skill_name": s.skill_name, "saved_at": str(s.saved_at)} for s in saved]


@router.post("/")
def save_skill(payload: SaveRequest, db: Session = Depends(get_db)):
    existing = db.query(SavedSkill).filter_by(
        user_id=payload.user_id, skill_name=payload.skill_name
    ).first()
    if existing:
        return {"status": "already saved"}
    db.add(SavedSkill(
        user_id=payload.user_id,
        skill_name=payload.skill_name,
        saved_at=datetime.now(timezone.utc),
    ))
    db.commit()
    return {"status": "saved"}


@router.delete("/{user_id}/{skill_name}")
def unsave_skill(user_id: str, skill_name: str, db: Session = Depends(get_db)):
    saved = db.query(SavedSkill).filter_by(
        user_id=user_id, skill_name=skill_name
    ).first()
    if not saved:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(saved)
    db.commit()
    return {"status": "removed"}