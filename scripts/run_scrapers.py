"""Manual scraper trigger."""

from dotenv import load_dotenv
load_dotenv()

from backend.scrapers.scheduler import run_all

if __name__ == "__main__":
    print("Running all scrapers...")
    run_all()
    print("Done.")