"""APScheduler cron job - runs all scrapers on SCRAPE_SCHEDULE."""

import os
from dotenv import load_dotenv
load_dotenv()

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from backend.utils.logger import logger

scheduler = BackgroundScheduler()


def run_all():
    """Delegate to run_scrapers.main() to avoid duplicating persist logic."""
    try:
        from scripts.run_scrapers import main
        main()
    except Exception as exc:
        logger.error("Scheduled scrape failed: {}", exc)


def start(schedule: str = None):
    cron = schedule or os.getenv("SCRAPE_SCHEDULE", "0 6 * * *")
    parts = cron.split()
    trigger = CronTrigger(
        minute=parts[0],
        hour=parts[1],
        day=parts[2],
        month=parts[3],
        day_of_week=parts[4],
    )
    scheduler.add_job(run_all, trigger, id="scrape_all", replace_existing=True)
    scheduler.start()
    logger.info("Scheduler started with schedule: {}", cron)