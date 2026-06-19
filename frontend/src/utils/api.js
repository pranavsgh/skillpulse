import axios from "axios";

const client = axios.create({ baseURL: "/api" });

export async function fetchSkills(params) {
  const res = await client.get("/skills/", { params });
  return res.data;
}

export async function fetchJobs(params) {
  const res = await client.get("/jobs/", { params });
  return res.data;
}

export async function sendChatMessage(message, targetRole, sessionId, prefs) {
  const res = await client.post("/chat/", {
    message,
    target_role: targetRole || null,
    session_id: sessionId || null,
    user_prefs: prefs || null,
  });
  return res.data;
}

export async function fetchSessions() {
  const res = await client.get("/chat/sessions");
  return res.data;
}

export async function fetchSession(sessionId) {
  const res = await client.get(`/chat/sessions/${sessionId}`);
  return res.data;
}

export async function deleteSession(sessionId) {
  const res = await client.delete(`/chat/sessions/${sessionId}`);
  return res.data;
}

export async function triggerScrape() {
  const res = await client.post("/scraper/run");
  return res.data;
}

export async function fetchStats() {
  const res = await client.get("/scraper/stats");
  return res.data;
}

export default client;