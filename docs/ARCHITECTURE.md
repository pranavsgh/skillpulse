# Architecture

SkillPulse has three layers:

1. **Scrapers** (`backend/scrapers/`) pull raw postings from Simplify, Indeed, and LinkedIn.
2. **Pipeline** (`backend/pipeline/`) classifies job type and extracts skills from descriptions.
3. **API** (`backend/api/`) serves aggregated skill counts and job listings to the React frontend, and proxies chat requests to the Claude API.

```
scrapers -> pipeline -> db -> api -> frontend
```

# Todo Both: expand with a diagram and notes on the cron scheduling flow once APScheduler is wired up.
