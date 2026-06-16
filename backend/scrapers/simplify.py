"""Simplify scraper - pulls listings.json from SimplifyJobs GitHub repos."""

INTERN_URL = "https://raw.githubusercontent.com/SimplifyJobs/Summer2025-Internships/dev/.github/scripts/listings.json"
NEW_GRAD_URL = "https://raw.githubusercontent.com/SimplifyJobs/New-Grad-Positions/dev/.github/scripts/listings.json"


def fetch_listings(url: str) -> list[dict]:
    # Todo Pranav: GET the JSON listings, return raw list of dicts
    raise NotImplementedError


def parse_listing(raw: dict) -> dict:
    # Todo Pranav: map url/application_link, title, company_name, locations[] -> job dict
    raise NotImplementedError


def scrape() -> list[dict]:
    # Todo Pranav: fetch both intern + new grad listings, parse, dedupe on url, return jobs
    raise NotImplementedError


if __name__ == "__main__":
    print(scrape())
