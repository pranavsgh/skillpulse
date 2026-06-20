"""Simplify scraper - pulls listings.json from SimplifyJobs GitHub repos."""

from datetime import datetime, timezone

import requests

INTERN_URL = "https://raw.githubusercontent.com/SimplifyJobs/Summer2025-Internships/dev/.github/scripts/listings.json"
NEW_GRAD_URL = "https://raw.githubusercontent.com/SimplifyJobs/New-Grad-Positions/dev/.github/scripts/listings.json"


def fetch_listings(url: str) -> list[dict]:
    response = requests.get(url, timeout=15)
    response.raise_for_status()
    return response.json()


def parse_listing(raw: dict) -> dict:
    locations = raw.get("locations") or []
    posted_at = None
    if raw.get("date_posted"):
        posted_at = datetime.fromtimestamp(raw["date_posted"], tz=timezone.utc)
    return {
        "title": raw.get("title", ""),
        "company": raw.get("company_name", ""),
        "location": "; ".join(locations) if locations else None,
        "url": raw.get("url") or raw.get("application_link"),
        "description": raw.get("title", ""),
        "source": "simplify",
        "posted_at": posted_at,
        "scraped_at": datetime.now(timezone.utc),
    }


def scrape() -> list[dict]:
    jobs = []
    seen_urls = set()

    for url, job_type in ((INTERN_URL, "internship"), (NEW_GRAD_URL, "new_grad")):
        for raw in fetch_listings(url):
            if not raw.get("active", True) or not raw.get("is_visible", True):
                continue

            job = parse_listing(raw)
            if not job["url"] or job["url"] in seen_urls:
                continue

            seen_urls.add(job["url"])
            job["job_type"] = job_type
            jobs.append(job)

    return jobs


if __name__ == "__main__":
    print(scrape())
