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

export async function sendChatMessage(message, targetRole) {
  const res = await client.post("/chat/", {
    message,
    target_role: targetRole || null,
  });
  return res.data.reply;
}

export default client;