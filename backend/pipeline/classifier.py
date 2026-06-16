"""Job type classifier - regex scoring of title + description."""

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


def classify(title: str, description: str) -> str:
    # Todo Both: score INTERN_PATTERNS vs NEW_GRAD_PATTERNS against title+description,
    # higher score wins, default "new_grad"
    raise NotImplementedError
