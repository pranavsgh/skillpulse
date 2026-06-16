"""LinkedIn scraper - Playwright headless Chromium automation."""

import asyncio

SEARCH_URL_TEMPLATE = "https://www.linkedin.com/jobs/search?keywords={query}&f_E={experience_level}"


async def scrape_async() -> list[dict]:
    # Todo Mutha: launch Playwright chromium, load SEARCH_URL_TEMPLATE,
    # parse .base-card elements (title, company, location, link),
    # visit each job page for .description__text, rate-limit with 2-5s random delays
    raise NotImplementedError


def scrape() -> list[dict]:
    # Todo Mutha: sync wrapper around scrape_async via asyncio.run
    return asyncio.run(scrape_async())


if __name__ == "__main__":
    print(scrape())
