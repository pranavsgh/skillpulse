"""GET /api/companies - company leaderboard with job counts and skill breakdown."""
from fastapi import APIRouter, Depends, Query
from sqlalchemy import func, desc, case
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
    # Single query: company totals
    total_q = db.query(Job.company, func.count(Job.id).label("total"))
    if job_type:
        total_q = total_q.filter(Job.job_type == job_type)
    total_rows = (
        total_q.group_by(Job.company)
        .order_by(desc("total"))
        .limit(limit)
        .all()
    )
    if not total_rows:
        return []

    company_names = [r.company for r in total_rows]
    total_map = {r.company: r.total for r in total_rows}

    # Single query: new_grad and internship counts
    type_rows = (
        db.query(
            Job.company,
            func.sum(case((Job.job_type == JobType.new_grad, 1), else_=0)).label("new_grad"),
            func.sum(case((Job.job_type == JobType.internship, 1), else_=0)).label("internship"),
        )
        .filter(Job.company.in_(company_names))
        .group_by(Job.company)
        .all()
    )
    type_map = {r.company: {"new_grad": r.new_grad or 0, "internship": r.internship or 0} for r in type_rows}

    # Single query: top skills per company
    skill_rows = (
        db.query(Job.company, Skill.name, func.count(job_skills.c.skill_id).label("cnt"))
        .join(job_skills, job_skills.c.job_id == Job.id)
        .join(Skill, Skill.id == job_skills.c.skill_id)
        .filter(Job.company.in_(company_names))
        .group_by(Job.company, Skill.name)
        .order_by(Job.company, desc("cnt"))
        .all()
    )

    # Build skill maps
    top_skills_map = {}
    skill_breakdown_map = {c: {s: 0 for s in TOP_SKILLS} for c in company_names}

    for company, skill_name, cnt in skill_rows:
        if company not in top_skills_map:
            top_skills_map[company] = []
        if len(top_skills_map[company]) < 3:
            top_skills_map[company].append(skill_name)
        if skill_name in TOP_SKILLS:
            skill_breakdown_map[company][skill_name] = cnt

    return [
        {
            "company": company,
            "total": total_map[company],
            "new_grad": type_map.get(company, {}).get("new_grad", 0),
            "internship": type_map.get(company, {}).get("internship", 0),
            "top_skills": top_skills_map.get(company, []),
            "skill_breakdown": skill_breakdown_map[company],
        }
        for company in company_names
    ]