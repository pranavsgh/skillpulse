"""POST /api/roadmap - generate a project-specific roadmap using Gemini and save it."""
import os
from dotenv import load_dotenv
load_dotenv()

from fastapi import APIRouter, Depends, HTTPException
from google import genai
from google.genai.errors import APIError as GeminiAPIError
from pydantic import BaseModel
from sqlalchemy import desc
from sqlalchemy.orm import Session

from backend.api.deps import get_db
from backend.db.models import Skill, SkillCount, JobType, UserProject

router = APIRouter()
GEMINI_MODEL = "gemini-2.5-flash"


class RoadmapRequest(BaseModel):
    project_id: int
    user_id: str
    project_content: str
    role: str | None = None
    level: str | None = None
    languages: list[str] = []


class RoadmapResponse(BaseModel):
    roadmap: str
    title: str


def build_skill_context(db: Session) -> str:
    lines = []
    for job_type in JobType:
        rows = (
            db.query(SkillCount, Skill)
            .join(Skill, SkillCount.skill_id == Skill.id)
            .filter(SkillCount.job_type == job_type)
            .order_by(desc(SkillCount.count))
            .limit(8)
            .all()
        )
        if not rows:
            continue
        label = "New Grad" if job_type == JobType.new_grad else "Internship"
        skills_str = ", ".join(f"{skill.name} ({sc.count})" for sc, skill in rows)
        lines.append(f"Top skills for {label} roles: {skills_str}")
    return "\n".join(lines) if lines else "No skill data available."


@router.post("/", response_model=RoadmapResponse)
def generate_roadmap(payload: RoadmapRequest, db: Session = Depends(get_db)):
    project = db.query(UserProject).filter_by(id=payload.project_id, user_id=payload.user_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    skill_context = build_skill_context(db)
    known = ", ".join(payload.languages) if payload.languages else "not specified"

    prompt = f"""You are SkillPulse's project roadmap generator with access to real-time CS job market data.

Market data:
{skill_context}

The user has chosen this project to build:
{payload.project_content}

User profile:
- Target role: {payload.role or "Software Engineer"}
- Experience level: {payload.level or "Beginner"}
- Languages known: {known}

Generate a detailed week-by-week timeline to complete this specific project over 3 months. Format exactly like this:

**Week 1-2 — Setup & Foundation**
- [ ] Task 1
- [ ] Task 2
- Milestone: [what they should have working]

**Week 3-4 — Core Features**
- [ ] Task 1
- [ ] Task 2
- Milestone: [what they should have working]

**Week 5-6 — Advanced Features**
- [ ] Task 1
- [ ] Task 2
- Milestone: [what they should have working]

**Week 7-8 — Polish & Testing**
- [ ] Task 1
- [ ] Task 2
- Milestone: [what they should have working]

**Week 9-10 — Deployment**
- [ ] Task 1
- [ ] Task 2
- Milestone: [what they should have working]

**Week 11-12 — Portfolio Ready**
- [ ] Task 1
- [ ] Task 2
- Milestone: [final deliverable]

**Tech Stack**
- [specific technologies based on market data]

**Key Skills You Will Learn**
- [5 in-demand skills this project teaches]

Be specific to THIS project. Make tasks concrete and actionable."""

    try:
        gemini = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
        response = gemini.models.generate_content(model=GEMINI_MODEL, contents=prompt)
        roadmap_text = response.text
        project.roadmap = roadmap_text
        db.commit()
        return RoadmapResponse(roadmap=roadmap_text, title=project.title)
    except GeminiAPIError as e:
        raise HTTPException(status_code=503, detail="AI service unavailable") from e


@router.get("/project/{project_id}")
def get_roadmap(project_id: int, user_id: str, db: Session = Depends(get_db)):
    project = db.query(UserProject).filter_by(id=project_id, user_id=user_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return {
        "roadmap": project.roadmap,
        "title": project.title,
        "status": project.status.value,
    }