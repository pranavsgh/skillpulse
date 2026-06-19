# SkillPulse

Scrapes CS new grad and internship postings from Simplify to surface trending languages, frameworks, and tools — with an AI-powered project advisor to help you build the right skills.

## What it does

- Scrapes new grad and internship postings from Simplify
- Extracts trending languages/frameworks/tools via keyword matching (upgradeable to spaCy NER)
- Displays skill analytics on a React dashboard
- Has a Claude API chatbot that recommends portfolio project ideas based on the role you want

## Tech stack

- **Scrapers**: Python, requests, GitHub API
- **Pipeline**: regex keyword matching (upgradeable to spaCy NER)
- **API**: FastAPI, Pydantic, SQLAlchemy
- **Database**: PostgreSQL (prod) / SQLite (dev)
- **Frontend**: React 18, Vite, Tailwind CSS, React Router, Recharts, Axios, Lucide icons
- **AI**: Anthropic Claude API (claude-sonnet-4-6)
- **Infra**: Docker, docker-compose, cron via APScheduler

## Team split

| Member | Owns |
|--------|------|
| Pranav | Simplify scraper, `/skills` + `/jobs` API endpoints, skills dashboard page |
| Mutha | Cron scheduler, `/chat` API + Claude proxy, chatbot UI page, landing page |
| Both | Skill extraction pipeline, database schema, React app scaffold |

## Project structure

```
backend/      FastAPI app, scrapers, skill extraction pipeline, db models
frontend/     React + Vite + Tailwind dashboard, chat UI
scripts/      DB setup + manual scraper trigger
docs/         architecture, API reference, contributing guide
```

## Getting started

```bash
# backend
cd backend
pip install -r requirements.txt
cp ../.env.example ../.env
python ../scripts/setup_db.py
uvicorn api.main:app --reload

# frontend
cd frontend
npm install
npm run dev
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), [docs/API.md](docs/API.md), and [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) for more.

This is an in-progress scaffold — most logic is stubbed with `Todo Pranav` / `Todo Mutha` / `Todo Both` markers pointing to who owns each piece.

## Contributors
- Muthamizh Arrasu Kamaraj — Frontend, AI/Chat, Deployment
- Pranav — Backend, API, Database

 
