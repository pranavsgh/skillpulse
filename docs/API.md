# API Reference

## `GET /api/health`
`{"status": "ok"}`

## `GET /api/skills/`
Query params: `job_type`, `category`, `limit` (default 20).
Returns an array of `{name, category, count}` sorted by count desc.

## `GET /api/jobs/`
Query params: `job_type`, `source`, `search`, `skip`, `limit` (default 25).
Returns `{total, jobs: [{id, title, company, location, url, job_type, source, scraped_at, skills}]}`.

## `POST /api/chat/`
Body: `{message, target_role?}`.
Returns `{reply}`. Proxies to the Claude API with job market context injected into the system prompt.

# Todo Both: fill in example requests/responses once routes are implemented.
