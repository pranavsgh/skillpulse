"""Job type classifier - regex scoring of title + description."""

import re

INTERN_PATTERNS = [
    r"\bintern(ship)?\b",
    r"\bco-op\b",
    r"\b(summer|fall|spring|winter)\s+20\d{2}\b",
]

NEW_GRAD_PATTERNS = [
    r"\bnew grad(uate)?\b",
    r"\bentry level\b",
    r"\bjunior\b",
    r"\bassociate\b",
    r"\b0-2 years\b",
    r"\brecent graduate\b",
    r"\bclass of 20\d{2}\b",
]


TITLE_WEIGHT = 3
DESCRIPTION_WEIGHT = 1


def _score(patterns: list[str], title: str, description: str) -> int:
    score = 0
    for pattern in patterns:
        if re.search(pattern, title, re.IGNORECASE):
            score += TITLE_WEIGHT
        if re.search(pattern, description, re.IGNORECASE):
            score += DESCRIPTION_WEIGHT
    return score


def classify(title: str, description: str) -> str:
    title = title or ""
    description = description or ""

    intern_score = _score(INTERN_PATTERNS, title, description)
    new_grad_score = _score(NEW_GRAD_PATTERNS, title, description)

    if intern_score > new_grad_score:
        return "internship"
    return "new_grad"
