"""ORM models: Job, Skill, SkillCount, job_skills association, Conversation, SavedSkill."""

import enum

from sqlalchemy import Column, Integer, String, Text, Enum, DateTime, Date, ForeignKey, Table, JSON
from sqlalchemy.orm import relationship

from backend.db.database import Base


class JobType(str, enum.Enum):
    new_grad = "new_grad"
    internship = "internship"


class RoleType(str, enum.Enum):
    swe = "swe"
    data = "data"
    ml_ai = "ml_ai"
    quant = "quant"
    devops = "devops"
    security = "security"
    mobile = "mobile"
    fullstack = "fullstack"
    other = "other"


class SkillCategory(str, enum.Enum):
    language = "language"
    framework = "framework"
    tool = "tool"


class Source(str, enum.Enum):
    simplify = "simplify"
    greenhouse = "greenhouse"
    remoteok = "remoteok"


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
    role_type = Column(Enum(RoleType), nullable=True)
    source = Column(Enum(Source), nullable=False)
    posted_at = Column(DateTime, nullable=True)
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
    role_type = Column(Enum(RoleType), nullable=True)
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


class SavedSkill(Base):
    __tablename__ = "saved_skills"

    id = Column(Integer, primary_key=True)
    user_id = Column(String, nullable=False, index=True)
    skill_name = Column(String, nullable=False)
    saved_at = Column(DateTime)


class ProjectStatus(str, enum.Enum):
    pending = "pending"
    completed = "completed"


class UserProject(Base):
    __tablename__ = "user_projects"

    id = Column(Integer, primary_key=True)
    user_id = Column(String, nullable=False, index=True)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    status = Column(Enum(ProjectStatus), nullable=False, default=ProjectStatus.pending)
    started_at = Column(DateTime)
    completed_at = Column(DateTime)
    roadmap = Column(Text, nullable=True)

# Todo Both: review indexes (e.g. on Job.job_type, Job.source) once query patterns are known
