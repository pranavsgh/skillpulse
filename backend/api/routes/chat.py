"""POST /api/chat proxying to Claude API."""

import os

from anthropic import Anthropic
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.api.deps import get_db
from backend.api.schemas import ChatRequest, ChatResponse

router = APIRouter()

client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

SYSTEM_PROMPT_TEMPLATE = (
    "You are SkillPulse's AI project advisor. You have access to real-time data "
    "about which programming languages, frameworks, and tools are most in-demand "
    "for CS new grad and internship roles. Based on this data, suggest concrete "
    "portfolio project ideas...\n\n{context}"
)


def build_context(db: Session) -> str:
    # Todo Mutha: query top 15 skills per job_type from skill_counts,
    # format into a context string for the system prompt
    raise NotImplementedError


@router.post("/", response_model=ChatResponse)
def chat(payload: ChatRequest, db: Session = Depends(get_db)):
    # Todo Mutha: build_context(db), call client.messages.create with
    # model="claude-sonnet-4-6", max_tokens=1024, system=SYSTEM_PROMPT_TEMPLATE.format(...)
    raise NotImplementedError
