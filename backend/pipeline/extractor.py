"""Skill extraction - keyword matching against job description text."""

import re

from sqlalchemy.orm import Session

from backend.db.models import Skill, SkillCategory

SKILL_DICTIONARY = {
    # Languages
    "python": "language",
    "java": "language",
    "javascript": "language",
    "typescript": "language",
    "c++": "language",
    "c#": "language",
    "go": "language",
    "rust": "language",
    "sql": "language",
    "r": "language",
    "swift": "language",
    "kotlin": "language",
    "ruby": "language",
    "bash": "language",
    "html": "language",
    "css": "language",
    "php": "language",

    # Frameworks & Libraries
    "react": "framework",
    "angular": "framework",
    "vue": "framework",
    "next.js": "framework",
    "node.js": "framework",
    "django": "framework",
    "flask": "framework",
    "fastapi": "framework",
    "spring": "framework",
    "tensorflow": "framework",
    "pytorch": "framework",
    "pandas": "framework",
    "numpy": "framework",
    "scikit-learn": "framework",
    "express": "framework",
    "ruby on rails": "framework",
    "flutter": "framework",
    "react native": "framework",
    "tailwind": "framework",
    "hadoop": "framework",
    "spark": "framework",

    # Tools, Platforms & Databases
    "docker": "tool",
    "kubernetes": "tool",
    "aws": "tool",
    "gcp": "tool",
    "azure": "tool",
    "git": "tool",
    "linux": "tool",
    "postgresql": "tool",
    "mongodb": "tool",
    "redis": "tool",
    "graphql": "tool",
    "terraform": "tool",
    "jenkins": "tool",
    "github actions": "tool",
    "kafka": "tool",
    "elasticsearch": "tool",
    "mysql": "tool",
    "sqlite": "tool",
    "snowflake": "tool",
    "tableau": "tool",
    "figma": "tool",
    "jira": "tool",
}

def extract_skills(description: str, db: Session) -> list[Skill]:
    if not description:
        return []

    extracted_skills = []

    for skill_name, skill_type in SKILL_DICTIONARY.items():
        # Escape the skill name to handle special characters like c++ or next.js safely
        escaped_skill = re.escape(skill_name)

        # \b handles standard word boundaries, while adjusting for trailing symbols like + or #
        pattern = rf"\b{escaped_skill}\b"
        if skill_name.endswith(('+', '#')):
            pattern = rf"\b{escaped_skill}"

        # Perform a case-insensitive regex search
        if re.search(pattern, description, re.IGNORECASE):
            skill_obj = db.query(Skill).filter_by(name=skill_name).first()
            if skill_obj is None:
                skill_obj = Skill(name=skill_name, category=SkillCategory(skill_type))
                db.add(skill_obj)
                db.flush()
            extracted_skills.append(skill_obj)

    return extracted_skills
