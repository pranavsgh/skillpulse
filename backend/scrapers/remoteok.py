"""RemoteOK scraper - pulls remote CS jobs from remoteok.com open API."""

from datetime import datetime, timezone
import requests

API_URL = "https://remoteok.com/api"

INTERN_KEYWORDS = {"intern", "internship", "co-op", "coop"}
NEW_GRAD_KEYWORDS = {"new grad", "entry level", "entry-level", "junior", "associate", "graduate"}
CS_KEYWORDS = {
    "engineer", "developer", "software", "backend", "frontend", "fullstack",
    "full stack", "data", "ml", "machine learning", "ai", "infrastructure",
    "platform", "devops", "sre", "security", "mobile", "ios", "android",
    "python", "javascript", "golang", "rust", "java", "typescript"
}


def is_cs_role(title: str, tags: list) -> bool:
    title_lower = title.lower()
    tags_lower = " ".join(tags).lower()
    return any(kw in title_lower or kw in tags_lower for kw in CS_KEYWORDS)


def classify_job_type(title: str, description: str) -> str:
    combined = (title + " " + description).lower()
    if any(kw in combined for kw in INTERN_KEYWORDS):
        return "internship"
    return "new_grad"


def scrape() -> list[dict]:
    try:
        res = requests.get(API_URL, headers={"User-Agent": "Mozilla/5.0"}, timeout=15)
        res.raise_for_status()
        raw_jobs = res.json()
    except Exception as e:
        print(f"  RemoteOK fetch failed: {e}")
        return []

    jobs = []
    seen_urls = set()

    for raw in raw_jobs:
        if not isinstance(raw, dict) or "position" not in raw:
            continue

        title = raw.get("position", "")
        tags = raw.get("tags") or []
        description = raw.get("description", "")
        url = raw.get("url") or raw.get("apply_url", "")

        if not url or url in seen_urls:
            continue
        if not is_cs_role(title, tags):
            continue

        seen_urls.add(url)
        job_type = classify_job_type(title, description)

        jobs.append({
            "title": title,
            "company": raw.get("company", ""),
            "location": "Remote",
            "url": url,
            "description": title + " " + " ".join(tags) + " " + description[:200],
            "source": "remoteok",
            "job_type": job_type,
            "scraped_at": datetime.now(timezone.utc),
        })

    return jobs


if __name__ == "__main__":
    jobs = scrape()
    print(f"{len(jobs)} jobs scraped from RemoteOK")
    for j in jobs[:5]:
        print(f"  {j['company']} — {j['title']} ({j['job_type']})")