"""APScheduler cron job - runs all scrapers on SCRAPE_SCHEDULE."""

import os
from dotenv import load_dotenv
load_dotenv()

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger

from backend.utils.logger import logger

scheduler = BackgroundScheduler()


def run_all():
    """Run all scrapers, classify, extract skills, and persist."""
    from backend.scrapers import simplify, indeed, linkedin
    from backend.db.database import SessionLocal
    from backend.db.models import Job, Skill, SkillCount, Source, JobType
    from backend.pipeline.classifier import classify
    from backend.pipeline.extractor import extract_skills
    from datetime import datetime, date

    db = SessionLocal()
    try:
        for scraper in (simplify, indeed, linkedin):
            name = scraper.__name__.split(".")[-1]
            logger.info("Running {} scraper...", name)
            try:
                jobs = scraper.scrape()
            except NotImplementedError:
                logger.warning("{} scraper not yet implemented, skipping", name)
                continue
            except Exception as exc:
                logger.error("{} scraper failed: {}", name, exc)
                continue

            for raw in jobs:
                # Skip if already in DB
                if db.query(Job).filter(Job.url == raw["url"]).first():
                    continue

                job_type_str = classify(raw.get("title", ""), raw.get("description", ""))
                job_type = JobType(job_type_str)
                source = Source(raw.get("source", name))

                job = Job(
                    title=raw.get("title", ""),
                    company=raw.get("company", ""),
                    location=raw.get("location"),
                    url=raw["url"],
                    description=raw.get("description", ""),
                    job_type=job_type,
                    source=source,
                    scraped_at=datetime.utcnow(),
                )

                skill_dicts = extract_skills(raw.get("description", ""))
                for sd in skill_dicts:
                    skill = db.query(Skill).filter(Skill.name == sd["name"]).first()
                    if not skill:
                        skill = Skill(name=sd["name"], category=sd["category"])
                        db.add(skill)
                        db.flush()

                    job.skills.append(skill)

                    sc = (
                        db.query(SkillCount)
                        .filter(
                            SkillCount.skill_id == skill.id,
                            SkillCount.job_type == job_type,
                        )
                        .first()
                    )
                    if sc:
                        sc.count += 1
                    else:
                        db.add(SkillCount(
                            skill_id=skill.id,
                            job_type=job_type,
                            count=1,
                            snapshot_date=date.today(),
                        ))

                db.add(job)

            db.commit()
            logger.info("{} scraper done", name)
    except Exception as exc:
        db.rollback()
        logger.error("run_all failed: {}", exc)
    finally:
        db.close()


def start(schedule: str = None):
    """Start the background scheduler."""
    cron = schedule or os.getenv("SCRAPE_SCHEDULE", "0 6 * * *")
    # cron string is "min hour dom month dow"
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