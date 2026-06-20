"""Manual scraper trigger."""
from dotenv import load_dotenv
load_dotenv()

from datetime import date
from backend.db.database import SessionLocal
from backend.db.models import Job, JobType, RoleType, Source, SkillCount
from backend.pipeline.extractor import extract_skills
from backend.pipeline.classifier import classify_role
from backend.scrapers import simplify, greenhouse, remoteok


def persist_job(db, job: dict) -> None:
    existing = db.query(Job).filter_by(url=job["url"]).first()
    if existing:
        # Backfill posted_at on rows scraped before we captured it, as long
        # as the listing is still live on the source API.
        if existing.posted_at is None and job.get("posted_at"):
            existing.posted_at = job["posted_at"]
        return
    role_type = classify_role(job.get("title", ""))
    db_job = Job(
        title=job["title"],
        company=job["company"],
        location=job.get("location"),
        url=job["url"],
        description=job.get("description"),
        job_type=JobType(job["job_type"]),
        role_type=role_type,
        source=Source(job["source"]),
        posted_at=job.get("posted_at"),
        scraped_at=job["scraped_at"],
    )
    db_job.skills = extract_skills(job.get("description") or "", db)
    db.add(db_job)


def rebuild_skill_counts(db) -> None:
    print("Rebuilding skill counts...")
    db.query(SkillCount).delete()
    db.flush()
    jobs = db.query(Job).all()
    counts: dict[tuple, int] = {}
    for job in jobs:
        for skill in job.skills:
            key = (skill.id, job.job_type, job.role_type)
            counts[key] = counts.get(key, 0) + 1
    for (skill_id, job_type, role_type), count in counts.items():
        db.add(SkillCount(
            skill_id=skill_id,
            job_type=job_type,
            role_type=role_type,
            count=count,
            snapshot_date=date.today(),
        ))
    db.flush()
    print(f"  {len(counts)} skill/job_type/role_type combinations indexed.")


def main():
    db = SessionLocal()
    try:
        print("Running simplify...")
        jobs = simplify.scrape()
        for job in jobs:
            persist_job(db, job)
        db.commit()
        print(f"  {len(jobs)} jobs scraped from Simplify.")

        print("Running greenhouse...")
        gh_jobs = greenhouse.scrape()
        for job in gh_jobs:
            persist_job(db, job)
        db.commit()
        print(f"  {len(gh_jobs)} jobs scraped from Greenhouse.")

        print("Running remoteok...")
        ro_jobs = remoteok.scrape()
        for job in ro_jobs:
            persist_job(db, job)
        db.commit()
        print(f"  {len(ro_jobs)} jobs scraped from RemoteOK.")

        rebuild_skill_counts(db)
        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    main()