import axios from "axios";

const DEVICE_ID_KEY = "skillpulse-device-id";

function getOrCreateDeviceId() {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

// Set once the Clerk user resolves (see ClerkUserSync). Falls back to the
// browser-scoped device id for signed-out/public requests so two different
// logged-in users on the same browser never share an owner identity.
let currentUserId = null;

export function setCurrentUserId(id) {
  currentUserId = id;
}

const client = axios.create({ baseURL: "/api" });

client.interceptors.request.use((config) => {
  config.headers["X-Device-Id"] = currentUserId || getOrCreateDeviceId();
  return config;
});

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

export async function generateBrief(sessionId, message) {
  const res = await client.post(`/chat/sessions/${sessionId}/brief`, { message });
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

export async function getSavedSkills(userId) {
  const res = await client.get(`/saved-skills/${userId}`);
  return res.data;
}

export async function saveSkill(userId, skillName) {
  const res = await client.post("/saved-skills/", { user_id: userId, skill_name: skillName });
  return res.data;
}

export async function unsaveSkill(userId, skillName) {
  const res = await client.delete(`/saved-skills/${userId}/${encodeURIComponent(skillName)}`);
  return res.data;
}

export default client;