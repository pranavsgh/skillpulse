"""GET /api/jobs with pagination + search."""

from fastapi import APIRouter, Depends, Query
from sqlalchemy import case, func, or_
from sqlalchemy.orm import Session

from backend.api.deps import get_db
from backend.api.schemas import JobListOut, JobOut
from backend.db.models import Job, JobType

router = APIRouter()


@router.get("/timeseries")
def jobs_timeseries(
    job_type: str | None = Query(default=None),
    source: str | None = Query(default=None),
    db: Session = Depends(get_db),
):
    # Prefer the listing's real posting date; fall back to when we scraped it
    # for older rows that predate posted_at capture.
    bucket_date = func.date(func.coalesce(Job.posted_at, Job.scraped_at))

    query = db.query(
        bucket_date.label("date"),
        func.count(Job.id).label("total"),
        func.sum(case((Job.job_type == JobType.new_grad, 1), else_=0)).label("new_grad"),
        func.sum(case((Job.job_type == JobType.internship, 1), else_=0)).label("internship"),
    )
    if job_type:
        query = query.filter(Job.job_type == job_type)
    if source:
        query = query.filter(Job.source == source)

    rows = query.group_by("date").order_by("date").all()
    return [
        {
            "date": r.date,
            "total": r.total,
            "new_grad": r.new_grad or 0,
            "internship": r.internship or 0,
        }
        for r in rows
    ]


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