"""POST /api/scraper/run - manual scrape trigger."""

from fastapi import APIRouter, BackgroundTasks, Depends
from sqlalchemy.orm import Session
from backend.api.deps import get_db
from backend.db.models import Job, JobType

router = APIRouter()


@router.post("/run")
def run_scraper(background_tasks: BackgroundTasks):
    """Trigger a scrape run in the background."""
    from scripts.run_scrapers import main
    background_tasks.add_task(main)
    return {"status": "scrape started"}


@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    """Return job counts by type."""
    total = db.query(Job).count()
    new_grad = db.query(Job).filter(Job.job_type == JobType.new_grad).count()
    internship = db.query(Job).filter(Job.job_type == JobType.internship).count()
    return {"total": total, "new_grad": new_grad, "internship": internship}