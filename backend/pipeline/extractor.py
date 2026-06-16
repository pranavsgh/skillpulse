"""Skill extraction - keyword matching against job description text."""

# Todo Both: flesh out full ~60 entry dictionary (language/framework/tool)
SKILL_DICTIONARY = {
    "python": "language",
    "java": "language",
    "javascript": "language",
    "typescript": "language",
    "c++": "language",
    "c#": "language",
    "go": "language",
    "rust": "language",
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
}


def extract_skills(description: str) -> list[dict]:
    # Todo Both: case-insensitive substring match against SKILL_DICTIONARY,
    # get-or-create Skill ORM objects, return list of Skill
    raise NotImplementedError
