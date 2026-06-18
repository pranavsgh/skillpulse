"""GET /api/skills with job_type + category filters."""

from fastapi import APIRouter, Depends, Query
from sqlalchemy import desc
from sqlalchemy.orm import Session

from backend.api.deps import get_db
from backend.api.schemas import SkillOut
from backend.db.models import Skill, SkillCount

router = APIRouter()


@router.get("/", response_model=list[SkillOut])
def list_skills(
    job_type: str | None = Query(default=None),
    category: str | None = Query(default=None),
    limit: int = Query(default=20),
    db: Session = Depends(get_db),
):
    query = (
        db.query(Skill, SkillCount)
        .join(SkillCount, SkillCount.skill_id == Skill.id)
    )
    if job_type:
        query = query.filter(SkillCount.job_type == job_type)
    if category:
        query = query.filter(Skill.category == category)

    rows = query.order_by(desc(SkillCount.count)).limit(limit).all()

    return [
        SkillOut(name=skill.name, category=skill.category.value, count=sc.count)
        for skill, sc in rows
    ]