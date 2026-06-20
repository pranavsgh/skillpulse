"""User project tracking — start a recommended project, see it as pending until marked finished."""

import re
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.api.deps import get_db
from backend.db.models import ProjectStatus, UserProject

router = APIRouter()


class StartProjectRequest(BaseModel):
    user_id: str
    content: str


def _derive_title(content: str) -> str:
    # Try ## or ### heading first (actual project name, skip the generic h1)
    h2 = re.search(r"^#{2,3}\s+(.+)$", content, re.MULTILINE)
    if h2:
        return h2.group(1).strip()[:100]
    # Fall back to first # heading
    h1 = re.search(r"^#\s+(.+)$", content, re.MULTILINE)
    if h1:
        return h1.group(1).strip()[:100]
    return content.strip().replace("\n", " ")[:80]


@router.get("/{user_id}")
def list_projects(user_id: str, db: Session = Depends(get_db)):
    projects = (
        db.query(UserProject)
        .filter_by(user_id=user_id)
        .order_by(UserProject.started_at.desc())
        .all()
    )
    return [
        {
            "id": p.id,
            "title": p.title,
            "content": p.content,
            "status": p.status.value,
            "started_at": str(p.started_at),
            "completed_at": str(p.completed_at) if p.completed_at else None,
            "has_roadmap": bool(getattr(p, "roadmap", None)),
        }
        for p in projects
    ]


@router.post("/")
def start_project(payload: StartProjectRequest, db: Session = Depends(get_db)):
    now = datetime.now(timezone.utc)
    project = UserProject(
        user_id=payload.user_id,
        title=_derive_title(payload.content),
        content=payload.content,
        status=ProjectStatus.pending,
        started_at=now,
    )
    db.add(project)
    db.commit()
    return {"id": project.id, "title": project.title, "status": project.status.value}


@router.post("/{project_id}/complete")
def complete_project(project_id: int, user_id: str, db: Session = Depends(get_db)):
    project = db.query(UserProject).filter_by(id=project_id, user_id=user_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    project.status = ProjectStatus.completed
    project.completed_at = datetime.now(timezone.utc)
    db.commit()
    return {"id": project.id, "status": project.status.value}