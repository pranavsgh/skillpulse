"""Dependency injection - DB session."""

from fastapi import Header

from backend.db.database import SessionLocal


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_owner_id(x_device_id: str | None = Header(default=None)) -> str | None:
    return x_device_id
