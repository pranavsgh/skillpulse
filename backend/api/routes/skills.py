"""GET /api/skills with job_type + category filters."""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from backend.api.deps import get_db
from backend.api.schemas import SkillOut

router = APIRouter()


@router.get("/", response_model=list[SkillOut])
def list_skills(
    job_type: str | None = Query(default=None),
    category: str | None = Query(default=None),
    limit: int = Query(default=20),
    db: Session = Depends(get_db),
):
    # Todo Pranav: query skill_counts joined to skills, filter by job_type/category,
    # order by count desc, limit, map to SkillOut
    raise NotImplementedError
