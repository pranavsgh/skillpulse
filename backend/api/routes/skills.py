"""GET /api/skills with job_type + category + role_type filters."""
from fastapi import APIRouter, Depends, Query
from sqlalchemy import func
from sqlalchemy.orm import Session
from backend.api.deps import get_db
from backend.api.schemas import SkillOut
from backend.db.models import Skill, SkillCount

router = APIRouter()

@router.get("/", response_model=list[SkillOut])
def list_skills(
    job_type: str | None = Query(default=None),
    category: str | None = Query(default=None),
    role_type: str | None = Query(default=None),
    limit: int = Query(default=20),
    db: Session = Depends(get_db),
):
    latest_date = db.query(func.max(SkillCount.snapshot_date)).scalar()
    if latest_date is None:
        return []

    count_sum = func.sum(SkillCount.count)
    query = (
        db.query(Skill.name, Skill.category, count_sum.label("count"))
        .join(SkillCount, SkillCount.skill_id == Skill.id)
        .filter(SkillCount.snapshot_date == latest_date)
    )

    if job_type:
        query = query.filter(SkillCount.job_type == job_type)
    if category:
        query = query.filter(Skill.category == category)
    if role_type:
        query = query.filter(SkillCount.role_type == role_type)

    rows = (
        query.group_by(Skill.id, Skill.name, Skill.category)
        .order_by(count_sum.desc())
        .limit(limit)
        .all()
    )

    return [
        SkillOut(name=name, category=skill_category.value, count=count)
        for name, skill_category, count in rows
    ]