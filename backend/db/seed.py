"""Optional seed data for local dev."""

from backend.db.database import SessionLocal


def seed():
    db = SessionLocal()
    # Todo Both: insert a handful of fake Job/Skill rows for local dev against SQLite
    db.close()


if __name__ == "__main__":
    seed()
