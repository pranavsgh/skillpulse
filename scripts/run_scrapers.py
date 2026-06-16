"""Manual scraper trigger."""

from backend.scrapers import simplify, indeed, linkedin


def main():
    # Todo Both: call each scraper, persist results via db session,
    # run extractor/classifier on new jobs
    for scraper in (simplify, indeed, linkedin):
        print(f"Running {scraper.__name__}...")
        scraper.scrape()


if __name__ == "__main__":
    main()
