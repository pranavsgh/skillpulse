"""Pydantic request/response models."""

from pydantic import BaseModel


class SkillOut(BaseModel):
    name: str
    category: str
    count: int


class JobOut(BaseModel):
    id: int
    title: str
    company: str
    location: str | None
    url: str
    job_type: str
    source: str
    scraped_at: str
    skills: list[str]


class JobListOut(BaseModel):
    total: int
    jobs: list[JobOut]


class ChatRequest(BaseModel):
    message: str
    target_role: str | None = None
    session_id: str | None = None
    user_prefs: dict | None = None


class ChatResponse(BaseModel):
    reply: str
    session_id: str