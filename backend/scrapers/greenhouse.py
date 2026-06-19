"""Greenhouse scraper - pulls jobs from public Greenhouse job board APIs."""

from datetime import datetime, timezone
import requests

# Top CS companies on Greenhouse with public APIs
COMPANIES = [
    "anthropic", "openai", "stripe", "airbnb", "dropbox", "figma",
    "notion", "linear", "vercel", "supabase", "planetscale", "railway",
    "datadog", "cloudflare", "hashicorp", "mongodb", "elastic",
    "confluent", "databricks", "snowflake", "dbt", "segment",
    "brex", "ramp", "plaid", "robinhood", "coinbase", "rippling",
    "gusto", "lattice", "asana", "airtable", "retool", "webflow",
]

INTERN_KEYWORDS = {"intern", "internship", "co-op", "coop"}
NEW_GRAD_KEYWORDS = {"new grad", "entry level", "entry-level", "junior", "associate", "university grad"}
CS_KEYWORDS = {
    "engineer", "developer", "software", "backend", "frontend", "fullstack",
    "full stack", "data", "ml", "machine learning", "ai", "infrastructure",
    "platform", "devops", "sre", "security", "mobile", "ios", "android"
}


def fetch_company_jobs(company: str) -> list[dict]:
    url = f"https://boards-api.greenhouse.io/v1/boards/{company}/jobs?content=true"
    try:
        res = requests.get(url, timeout=10)
        if res.status_code != 200:
            return []
        return res.json().get("jobs", [])
    except Exception:
        return []


def classify_job_type(title: str, content: str) -> str | None:
    title_lower = title.lower()
    content_lower = (content or "").lower()[:500]
    combined = title_lower + " " + content_lower

    if any(kw in combined for kw in INTERN_KEYWORDS):
        return "internship"
    if any(kw in combined for kw in NEW_GRAD_KEYWORDS):
        return "new_grad"
    return None


def is_cs_role(title: str) -> bool:
    title_lower = title.lower()
    return any(kw in title_lower for kw in CS_KEYWORDS)


def parse_job(raw: dict, company: str) -> dict | None:
    title = raw.get("title", "")
    if not is_cs_role(title):
        return None

    content = raw.get("content", "")
    job_type = classify_job_type(title, content)
    if not job_type:
        return None

    url = raw.get("absolute_url", "")
    if not url:
        return None

    location = None
    offices = raw.get("offices") or raw.get("location") or []
    if isinstance(offices, list) and offices:
        location = "; ".join(o.get("name", "") for o in offices if o.get("name"))
    elif isinstance(offices, dict):
        location = offices.get("name")

    return {
        "title": title,
        "company": company.capitalize(),
        "location": location,
        "url": url,
        "description": title + " " + content[:300],
        "source": "greenhouse",
        "job_type": job_type,
        "scraped_at": datetime.now(timezone.utc),
    }


def scrape() -> list[dict]:
    jobs = []
    seen_urls = set()

    for company in COMPANIES:
        raw_jobs = fetch_company_jobs(company)
        for raw in raw_jobs:
            job = parse_job(raw, company)
            if not job or job["url"] in seen_urls:
                continue
            seen_urls.add(job["url"])
            jobs.append(job)

    return jobs


if __name__ == "__main__":
    jobs = scrape()
    print(f"{len(jobs)} jobs scraped from Greenhouse")
    for j in jobs[:5]:
        print(f"  {j['company']} — {j['title']} ({j['job_type']})")