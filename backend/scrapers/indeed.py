"""Indeed scraper - RSS feeds + BeautifulSoup for full descriptions."""

import time
from datetime import datetime, timezone
from urllib.parse import quote_plus

import feedparser
import requests
from bs4 import BeautifulSoup

from backend.pipeline.classifier import classify

QUERIES = [
    "software engineer new grad",
    "software engineer intern",
    "cs internship",
    "new grad software developer",
    "junior software engineer",
    "computer science internship",
]

RSS_URL_TEMPLATE = "https://www.indeed.com/rss?q={query}&sort=date"


def fetch_rss(query: str) -> list[dict]:
    url = RSS_URL_TEMPLATE.format(query=quote_plus(query))
    feed = feedparser.parse(url)
    return feed.entries


def fetch_description(job_url: str) -> str:
    response = requests.get(job_url, timeout=15, headers={"User-Agent": "Mozilla/5.0"})
    response.raise_for_status()
    soup = BeautifulSoup(response.text, "html.parser")
    container = soup.find(id="jobDescriptionText")
    if container is None:
        return ""
    return container.get_text(separator="\n", strip=True)


def scrape() -> list[dict]:
    jobs = []
    seen_urls = set()

    for query in QUERIES:
        for entry in fetch_rss(query):
            url = entry.get("link")
            if not url or url in seen_urls:
                continue
            seen_urls.add(url)

            parts = [p.strip() for p in entry.get("title", "").split(" - ")]
            title = parts[0] if parts else ""
            company = parts[1] if len(parts) > 1 else ""
            location = parts[2] if len(parts) > 2 else None

            description = fetch_description(url)
            time.sleep(1)

            jobs.append({
                "title": title,
                "company": company,
                "location": location,
                "url": url,
                "description": description,
                "job_type": classify(title, description),
                "source": "indeed",
                "scraped_at": datetime.now(timezone.utc),
            })

    return jobs


if __name__ == "__main__":
    print(scrape())
