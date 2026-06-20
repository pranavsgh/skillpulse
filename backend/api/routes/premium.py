"""Premium access check — whitelist + future Stripe integration."""
import os
from fastapi import APIRouter

router = APIRouter()

def get_premium_ids() -> set[str]:
    raw = os.getenv("PREMIUM_USER_IDS", "")
    return {uid.strip() for uid in raw.split(",") if uid.strip()}


def is_premium(user_id: str) -> bool:
    return user_id in get_premium_ids()


@router.get("/{user_id}")
def check_premium(user_id: str):
    return {"premium": is_premium(user_id)}