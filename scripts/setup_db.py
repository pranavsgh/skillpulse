"""Creates all tables."""

from backend.db.database import Base, engine
from backend.db import models  # noqa: F401 - ensures models are registered


def main():
    Base.metadata.create_all(bind=engine)
    print("Tables created.")


if __name__ == "__main__":
    main()
