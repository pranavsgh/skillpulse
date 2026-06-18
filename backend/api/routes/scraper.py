"""POST /api/scraper/run - manual scrape trigger."""

from fastapi import APIRouter, BackgroundTasks

router = APIRouter()


@router.post("/run")
def run_scraper(background_tasks: BackgroundTasks):
    """Trigger a scrape run in the background."""
    from scripts.run_scrapers import main
    background_tasks.add_task(main)
    return {"status": "scrape started"}