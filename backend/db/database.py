"""SQLAlchemy engine + session factory."""

import os

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./skillpulse.db")

# Todo Both: tune engine args (e.g. connect_args for sqlite), pool settings for prod
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
