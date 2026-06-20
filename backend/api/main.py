"""FastAPI app - CORS, router includes."""
from dotenv import load_dotenv
load_dotenv()

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api.routes import skills, jobs, chat, scraper, saved_skills, companies
from backend.scrapers.scheduler import start as start_scheduler

app = FastAPI(title="SkillPulse API")

origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(skills.router, prefix="/api/skills", tags=["skills"])
app.include_router(jobs.router, prefix="/api/jobs", tags=["jobs"])
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(scraper.router, prefix="/api/scraper", tags=["scraper"])
app.include_router(saved_skills.router, prefix="/api/saved-skills", tags=["saved_skills"])
app.include_router(companies.router, prefix="/api/companies", tags=["companies"])

start_scheduler()

@app.get("/api/health")
def health():
    return {"status": "ok"}