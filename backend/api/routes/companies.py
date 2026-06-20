"""GET /api/companies - company leaderboard with job counts and skill breakdown."""
from fastapi import APIRouter, Depends, Query
from sqlalchemy import func, desc
from sqlalchemy.orm import Session
from backend.api.deps import get_db
from backend.db.models import Job, Skill, JobType, job_skills

router = APIRouter()

TOP_SKILLS = ["python", "java", "javascript", "linux", "go", "sql",
              "typescript", "c++", "react", "mongodb", "databricks", "ruby"]


@router.get("/")
def list_companies(
    limit: int = Query(default=20),
    job_type: str | None = Query(default=None),
    db: Session = Depends(get_db),
):
    query = db.query(Job.company, func.count(Job.id).label("total"))
    if job_type:
        query = query.filter(Job.job_type == job_type)

    rows = (
        query.group_by(Job.company)
        .order_by(desc("total"))
        .limit(limit)
        .all()
    )

    result = []
    for company, total in rows:
        # Top 3 skills
        skill_rows = (
            db.query(Skill.name, func.count(job_skills.c.skill_id).label("cnt"))
            .join(job_skills, job_skills.c.skill_id == Skill.id)
            .join(Job, Job.id == job_skills.c.job_id)
            .filter(Job.company == company)
            .group_by(Skill.name)
            .order_by(desc("cnt"))
            .limit(3)
            .all()
        )
        top_skills = [s.name for s in skill_rows]

        # Skill breakdown for chart
        skill_breakdown = {}
        for skill_name in TOP_SKILLS:
            cnt = (
                db.query(func.count(Job.id))
                .join(job_skills, job_skills.c.job_id == Job.id)
                .join(Skill, Skill.id == job_skills.c.skill_id)
                .filter(Job.company == company, Skill.name == skill_name)
                .scalar()
            )
            skill_breakdown[skill_name] = cnt or 0

        new_grad = db.query(Job).filter_by(company=company, job_type=JobType.new_grad).count()
        internship = db.query(Job).filter_by(company=company, job_type=JobType.internship).count()

        result.append({
            "company": company,
            "total": total,
            "new_grad": new_grad,
            "internship": internship,
            "top_skills": top_skills,
            "skill_breakdown": skill_breakdown,
        })

    return result