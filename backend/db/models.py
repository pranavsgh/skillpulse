"""ORM models: Job, Skill, SkillCount, job_skills association, Conversation."""

import enum

from sqlalchemy import Column, Integer, String, Text, Enum, DateTime, Date, ForeignKey, Table, JSON
from sqlalchemy.orm import relationship

from backend.db.database import Base


class JobType(str, enum.Enum):
    new_grad = "new_grad"
    internship = "internship"


class SkillCategory(str, enum.Enum):
    language = "language"
    framework = "framework"
    tool = "tool"


class Source(str, enum.Enum):
    simplify = "simplify"
    greenhouse = "greenhouse"


job_skills = Table(
    "job_skills",
    Base.metadata,
    Column("job_id", Integer, ForeignKey("jobs.id"), primary_key=True),
    Column("skill_id", Integer, ForeignKey("skills.id"), primary_key=True),
)


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    company = Column(String, nullable=False)
    location = Column(String)
    url = Column(String, unique=True, nullable=False)
    description = Column(Text)
    job_type = Column(Enum(JobType), nullable=False)
    source = Column(Enum(Source), nullable=False)
    scraped_at = Column(DateTime)

    skills = relationship("Skill", secondary=job_skills, back_populates="jobs")


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, nullable=False)
    category = Column(Enum(SkillCategory), nullable=False)

    jobs = relationship("Job", secondary=job_skills, back_populates="skills")


class SkillCount(Base):
    __tablename__ = "skill_counts"

    id = Column(Integer, primary_key=True)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    job_type = Column(Enum(JobType), nullable=False)
    count = Column(Integer, default=0)
    snapshot_date = Column(Date)

    skill = relationship("Skill")


class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True)
    session_id = Column(String, unique=True, nullable=False, index=True)
    owner_id = Column(String, nullable=True, index=True)
    messages = Column(JSON, default=list)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)


class BriefGeneration(Base):
    __tablename__ = "brief_generations"

    id = Column(Integer, primary_key=True)
    owner_id = Column(String, nullable=True, index=True)
    created_at = Column(DateTime)

# Todo Both: review indexes (e.g. on Job.job_type, Job.source) once query patterns are known
