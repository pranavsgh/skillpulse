"""Classify job titles into role types."""
import re
from backend.db.models import RoleType

ROLE_PATTERNS = {
    RoleType.ml_ai: [
        r"\bml\b", r"\bmachine learning\b", r"\bartificial intelligence\b",
        r"\bai\b", r"\bdeep learning\b", r"\bllm\b", r"\bnlp\b",
        r"\bcomputer vision\b", r"\bdata science\b", r"\bresearch scientist\b",
        r"\bapplied scientist\b", r"\bai/ml\b", r"\bml engineer\b",
    ],
    RoleType.quant: [
        r"\bquant\b", r"\bquantitative\b", r"\balgorithmic trading\b",
        r"\bfinancial engineer\b", r"\brisk\b.*\bengineer\b",
        r"\bderivatives\b", r"\btrading\b.*\bengineer\b",
    ],
    RoleType.data: [
        r"\bdata engineer\b", r"\bdata analyst\b", r"\bdata scientist\b",
        r"\bbusiness intelligence\b", r"\banalytics engineer\b",
        r"\bdata platform\b", r"\bdbt\b", r"\betl\b", r"\bdata warehouse\b",
    ],
    RoleType.devops: [
        r"\bdevops\b", r"\bsre\b", r"\bsite reliability\b", r"\bplatform engineer\b",
        r"\binfrastructure\b", r"\bcloud engineer\b", r"\bdeployment\b",
        r"\bkubernetes\b.*\bengineer\b", r"\bci/cd\b",
    ],
    RoleType.security: [
        r"\bsecurity engineer\b", r"\bcybersecurity\b", r"\bpenetration\b",
        r"\bapplication security\b", r"\bsecurity analyst\b", r"\bdevsecops\b",
        r"\bthreat\b", r"\bvulnerability\b",
    ],
    RoleType.mobile: [
        r"\bmobile\b", r"\bios\b", r"\bandroid\b", r"\bswift\b.*\bengineer\b",
        r"\bkotlin\b.*\bengineer\b", r"\breact native\b.*\bengineer\b",
        r"\bflutter\b.*\bengineer\b",
    ],
    RoleType.fullstack: [
        r"\bfull.?stack\b", r"\bfullstack\b", r"\bfull stack\b",
        r"\bfrontend\b", r"\bfront.end\b", r"\bui engineer\b",
        r"\bweb developer\b", r"\bweb engineer\b",
    ],
    RoleType.swe: [
        r"\bsoftware engineer\b", r"\bsoftware developer\b",
        r"\bbackend engineer\b", r"\bback.end engineer\b",
        r"\bsoftware development\b", r"\bsde\b", r"\bswe\b",
    ],
}


def classify_role(title: str) -> RoleType:
    title_lower = title.lower()
    for role_type, patterns in ROLE_PATTERNS.items():
        if any(re.search(p, title_lower) for p in patterns):
            return role_type
    return RoleType.other