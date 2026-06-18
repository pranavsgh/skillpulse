"""POST /api/chat proxying to Claude API, with a Gemini fallback for off-topic requests."""

import os
import re
import threading
import time
import uuid
from collections import defaultdict, deque
from datetime import datetime

from dotenv import load_dotenv
load_dotenv()

from anthropic import Anthropic, APIError as AnthropicAPIError
from fastapi import APIRouter, Depends, HTTPException
from google import genai
from google.genai.errors import APIError as GeminiAPIError
from sqlalchemy import desc
from sqlalchemy.orm import Session

from backend.api.deps import get_db
from backend.api.schemas import ChatRequest, ChatResponse
from backend.db.models import Conversation, JobType, Skill, SkillCount

router = APIRouter()


def _get_client() -> Anthropic:
    return Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))


_gemini_client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

GEMINI_MODEL = "gemini-2.5-flash-lite"

SYSTEM_PROMPT_TEMPLATE = (
    "You are SkillPulse's AI project advisor. You have access to real-time data "
    "about which programming languages, frameworks, and tools are most in-demand "
    "for CS new grad and internship roles. Based on this data, suggest concrete "
    "portfolio project ideas.\n\n{context}"
)

RATE_LIMIT_MAX_REQUESTS = 10
RATE_LIMIT_WINDOW_SECONDS = 60

_request_log: dict[str, deque] = defaultdict(deque)
_rate_limit_lock = threading.Lock()


def _check_rate_limit(session_id: str) -> None:
    now = time.monotonic()
    with _rate_limit_lock:
        log = _request_log[session_id]
        while log and now - log[0] > RATE_LIMIT_WINDOW_SECONDS:
            log.popleft()
        if len(log) >= RATE_LIMIT_MAX_REQUESTS:
            raise HTTPException(
                status_code=429,
                detail="Too many messages — please wait a moment before sending another.",
            )
        log.append(now)


PROJECT_INTENT_PATTERNS = [
    r"\bproject(s)?\b",
    r"\bportfolio\b",
    r"\bbuild\b",
    r"\bidea(s)?\b",
    r"\bsuggest\b",
    r"\brecommend\b",
    r"\bskill(s)?\b",
    r"\blearn\b",
    r"\bresume\b",
    r"\bpractice\b",
    r"\bwhat should i (build|make|create|do)\b",
]


def is_project_related(message: str) -> bool:
    return any(re.search(pattern, message, re.IGNORECASE) for pattern in PROJECT_INTENT_PATTERNS)


def _call_gemini(message: str) -> str:
    response = _gemini_client.models.generate_content(
        model=GEMINI_MODEL,
        contents=message,
    )
    return response.text


def build_context(db: Session) -> str:
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
        skills_str = ", ".join(f"{skill.name} ({sc.count})" for sc, skill in rows)
        lines.append(f"Top skills for {label} roles: {skills_str}")

    if not lines:
        return "No skill data available yet — scrapers have not run."
    return "\n".join(lines)


def get_or_create_conversation(db: Session, session_id: str) -> Conversation:
    convo = db.query(Conversation).filter_by(session_id=session_id).first()
    if not convo:
        convo = Conversation(session_id=session_id, messages=[], updated_at=datetime.utcnow())
        db.add(convo)
        db.flush()
    return convo


@router.get("/sessions")
def list_sessions(db: Session = Depends(get_db)):
    """List all conversation sessions ordered by most recent."""
    convos = (
        db.query(Conversation)
        .order_by(desc(Conversation.updated_at))
        .all()
    )
    return [
        {
            "session_id": c.session_id,
            "updated_at": str(c.updated_at),
            "preview": c.messages[0]["content"][:60] + "..." if c.messages else "Empty chat",
            "message_count": len(c.messages or []),
        }
        for c in convos
    ]


@router.get("/sessions/{session_id}")
def get_session(session_id: str, db: Session = Depends(get_db)):
    """Load messages for a specific session."""
    convo = db.query(Conversation).filter_by(session_id=session_id).first()
    if not convo:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"session_id": convo.session_id, "messages": convo.messages or []}


@router.delete("/sessions/{session_id}")
def delete_session(session_id: str, db: Session = Depends(get_db)):
    """Delete a conversation session."""
    convo = db.query(Conversation).filter_by(session_id=session_id).first()
    if not convo:
        raise HTTPException(status_code=404, detail="Session not found")
    db.delete(convo)
    db.commit()
    return {"deleted": session_id}


@router.post("/", response_model=ChatResponse)
def chat(payload: ChatRequest, db: Session = Depends(get_db)):
    session_id = payload.session_id or str(uuid.uuid4())
    _check_rate_limit(session_id)

    convo = get_or_create_conversation(db, session_id)
    history = list(convo.messages or [])
    history.append({"role": "user", "content": payload.message})

    try:
        if is_project_related(payload.message):
            context = build_context(db)
            system = SYSTEM_PROMPT_TEMPLATE.format(context=context)
            if payload.target_role:
                system += f"\n\nThe user is targeting: {payload.target_role} roles."

            response = _get_client().messages.create(
                model="claude-sonnet-4-6",
                max_tokens=1024,
                system=system,
                messages=history,
            )
            reply = response.content[0].text
        else:
            reply = _call_gemini(payload.message)
    except (AnthropicAPIError, GeminiAPIError) as exc:
        raise HTTPException(
            status_code=503,
            detail="The AI service is temporarily unavailable. Please try again shortly.",
        ) from exc

    history.append({"role": "assistant", "content": reply})
    convo.messages = history
    convo.updated_at = datetime.utcnow()
    db.commit()

    return ChatResponse(reply=reply, session_id=session_id)