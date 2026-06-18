"""GET /api/jobs with pagination + search."""

from fastapi import APIRouter, Depends, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session

from backend.api.deps import get_db
from backend.api.schemas import JobListOut, JobOut
from backend.db.models import Job

router = APIRouter()


@router.get("/", response_model=JobListOut)
def list_jobs(
    job_type: str | None = Query(default=None),
    source: str | None = Query(default=None),
    search: str | None = Query(default=None),
    skip: int = Query(default=0),
    limit: int = Query(default=25),
    db: Session = Depends(get_db),
):
    query = db.query(Job)

    if job_type:
        query = query.filter(Job.job_type == job_type)
    if source:
        query = query.filter(Job.source == source)
    if search:
        query = query.filter(
            or_(
                Job.title.ilike(f"%{search}%"),
                Job.company.ilike(f"%{search}%"),
            )
        )

    total = query.count()
    jobs = query.offset(skip).limit(limit).all()

    return JobListOut(
        total=total,
        jobs=[
            JobOut(
                id=j.id,
                title=j.title,
                company=j.company,
                location=j.location,
                url=j.url,
                job_type=j.job_type.value,
                source=j.source.value,
                scraped_at=str(j.scraped_at),
                skills=[s.name for s in j.skills],
            )
            for j in jobs
        ],
    )