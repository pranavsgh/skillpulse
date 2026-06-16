"""Indeed scraper - RSS feeds + BeautifulSoup for full descriptions."""

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
    # Todo Pranav: hit RSS_URL_TEMPLATE with feedparser, return entries
    raise NotImplementedError


def fetch_description(job_url: str) -> str:
    # Todo Pranav: BeautifulSoup GET on job_url, extract full description text
    raise NotImplementedError


def scrape() -> list[dict]:
    # Todo Pranav: loop QUERIES, fetch_rss, fetch_description per job, classify, return jobs
    raise NotImplementedError


if __name__ == "__main__":
    print(scrape())
