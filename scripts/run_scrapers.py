"""Manual scraper trigger."""

from backend.db.database import SessionLocal
from backend.db.models import Job, JobType, Source
from backend.pipeline.extractor import extract_skills
from backend.scrapers import simplify, indeed, linkedin


def persist_job(db, job: dict) -> None:
    if db.query(Job).filter_by(url=job["url"]).first():
        return

    db_job = Job(
        title=job["title"],
        company=job["company"],
        location=job.get("location"),
        url=job["url"],
        description=job.get("description"),
        job_type=JobType(job["job_type"]),
        source=Source(job["source"]),
        scraped_at=job["scraped_at"],
    )
    db_job.skills = extract_skills(job.get("description") or "", db)
    db.add(db_job)


def main():
    db = SessionLocal()
    try:
        for scraper in (simplify, indeed, linkedin):
            print(f"Running {scraper.__name__}...")
            try:
                jobs = scraper.scrape()
            except NotImplementedError:
                print(f"  {scraper.__name__} not implemented yet, skipping.")
                continue

            for job in jobs:
                persist_job(db, job)
            db.commit()
            print(f"  {len(jobs)} jobs scraped.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
