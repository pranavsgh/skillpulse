"""GET /api/jobs with pagination + search."""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from backend.api.deps import get_db
from backend.api.schemas import JobListOut

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
    # Todo Pranav: query jobs, filter by job_type/source/search (title/company ILIKE),
    # paginate with skip/limit, return {total, jobs}
    raise NotImplementedError
