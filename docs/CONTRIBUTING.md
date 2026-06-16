# Contributing

## Team split

| Member | Owns |
|--------|------|
| Pranav | Simplify + Indeed scrapers, `/skills` + `/jobs` API endpoints, skills dashboard page, job listings page |
| Mutha | LinkedIn scraper + cron scheduler, `/chat` API + Claude proxy, chatbot UI page, landing page |
| Both | Skill extraction pipeline, database schema, React app scaffold |

## Local setup

```bash
# backend
cd backend && pip install -r requirements.txt
python ../scripts/setup_db.py

# frontend
cd frontend && npm install && npm run dev
```

## Conventions

- Backend: Python, type hints where practical, FastAPI dependency injection for DB sessions.
- Frontend: functional components, hooks for data fetching, Tailwind for styling.
- Open a PR against `main`; keep scraper changes and pipeline changes in separate commits when possible.
