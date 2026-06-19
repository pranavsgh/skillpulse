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
    "matlab": "language",
    "sas": "language",
    "vba": "language",
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
    "keras": "framework",
    "xgboost": "framework",
    "opencv": "framework",
    "huggingface": "framework",
    "nltk": "framework",
    "spacy": "framework",
    "quantlib": "framework",
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
    "excel": "tool",
    "power bi": "tool",
    "looker": "tool",
    "spss": "tool",
    "stata": "tool",
    "alteryx": "tool",
    "power query": "tool",
    "google sheets": "tool",
    "bloomberg terminal": "tool",
    "mlflow": "tool",
    "airflow": "tool",
    "databricks": "tool",
    "sagemaker": "tool",
    "vertex ai": "tool",
    "splunk": "tool",
    "wireshark": "tool",
    "nmap": "tool",
    "metasploit": "tool",
    "nessus": "tool",
    "burp suite": "tool",
    "kali linux": "tool",
    "crowdstrike": "tool",
    "palo alto": "tool",
    "fortinet": "tool",
    "okta": "tool",
    "siem": "tool",
    "vpn": "tool",
    "firewall": "tool",
}

# Skills that need special patterns to avoid false positives
SPECIAL_PATTERNS = {
    "r": r"\b[Rr]\b(?!&|\s*and\s+[Dd])",  # exclude R&D
    "go": r"\b[Gg]o\b(?!ogle|ogl|lang)",   # exclude Google, Golang handled separately
}


def extract_skills(description: str, db: Session) -> list[Skill]:
    if not description:
        return []

    extracted_skills = []
    for skill_name, skill_type in SKILL_DICTIONARY.items():
        if skill_name in SPECIAL_PATTERNS:
            pattern = SPECIAL_PATTERNS[skill_name]
        else:
            escaped_skill = re.escape(skill_name)
            pattern = rf"\b{escaped_skill}\b"
            if skill_name.endswith(('+', '#')):
                pattern = rf"\b{escaped_skill}"

        if re.search(pattern, description, re.IGNORECASE):
            skill_obj = db.query(Skill).filter_by(name=skill_name).first()
            if skill_obj is None:
                skill_obj = Skill(name=skill_name, category=SkillCategory(skill_type))
                db.add(skill_obj)
                db.flush()
            extracted_skills.append(skill_obj)

    return extracted_skills