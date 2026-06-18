"""POST /api/chat proxying to Claude API."""

import os

from dotenv import load_dotenv
load_dotenv()

from anthropic import Anthropic
from fastapi import APIRouter, Depends
from sqlalchemy import desc
from sqlalchemy.orm import Session

from backend.api.deps import get_db
from backend.api.schemas import ChatRequest, ChatResponse
from backend.db.models import JobType, Skill, SkillCount

router = APIRouter()


def _get_client() -> Anthropic:
    return Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))


SYSTEM_PROMPT_TEMPLATE = (
    "You are SkillPulse's AI project advisor. You have access to real-time data "
    "about which programming languages, frameworks, and tools are most in-demand "
    "for CS new grad and internship roles. Based on this data, suggest concrete "
    "portfolio project ideas.\n\n{context}"
)


def build_context(db: Session) -> str:
    """Query top 15 skills per job_type and format into a context string."""
    lines = []
    for job_type in JobType:
        rows = (
            db.query(SkillCount, Skill)
            .join(Skill, SkillCount.skill_id == Skill.id)
            .filter(SkillCount.job_type == job_type)
            .order_by(desc(SkillCount.count))
            .limit(15)
            .all()
        )
        if not rows:
            continue
        label = "New Grad" if job_type == JobType.new_grad else "Internship"
        skills_str = ", ".join(
            f"{skill.name} ({sc.count})" for sc, skill in rows
        )
        lines.append(f"Top skills for {label} roles: {skills_str}")

    if not lines:
        return "No skill data available yet — scrapers have not run."
    return "\n".join(lines)


@router.post("/", response_model=ChatResponse)
def chat(payload: ChatRequest, db: Session = Depends(get_db)):
    context = build_context(db)
    system = SYSTEM_PROMPT_TEMPLATE.format(context=context)

    if payload.target_role:
        system += f"\n\nThe user is targeting: {payload.target_role} roles."

    response = _get_client().messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        system=system,
        messages=[{"role": "user", "content": payload.message}],
    )
    return ChatResponse(reply=response.content[0].text)