"""Manual scraper trigger."""

from dotenv import load_dotenv
load_dotenv()

from datetime import date
from backend.db.database import SessionLocal
from backend.db.models import Job, JobType, Source, SkillCount, job_skills
from backend.pipeline.extractor import extract_skills
from backend.scrapers import simplify, indeed


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


def rebuild_skill_counts(db) -> None:
    """Recount skills from all jobs and repopulate skill_counts."""
    print("Rebuilding skill counts...")
    db.query(SkillCount).delete()
    db.flush()

    jobs = db.query(Job).all()
    counts: dict[tuple, int] = {}
    for job in jobs:
        for skill in job.skills:
            key = (skill.id, job.job_type)
            counts[key] = counts.get(key, 0) + 1

    for (skill_id, job_type), count in counts.items():
        db.add(SkillCount(
            skill_id=skill_id,
            job_type=job_type,
            count=count,
            snapshot_date=date.today(),
        ))
    db.flush()
    print(f"  {len(counts)} skill/job_type combinations indexed.")


def main():
    db = SessionLocal()
    try:
        for scraper in (simplify, indeed):
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

        rebuild_skill_counts(db)
        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    main()