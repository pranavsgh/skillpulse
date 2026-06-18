import axios from "axios";

const client = axios.create({ baseURL: "/api" });

export function fetchSkills(params) {
  // Todo Pranav: GET /skills/ with job_type + category + limit params
  throw new Error("not implemented");
}

export function fetchJobs(params) {
  // Todo Pranav: GET /jobs/ with job_type + source + search + skip + limit params
  throw new Error("not implemented");
}

export async function sendChatMessage(message, targetRole) {
  const res = await client.post("/chat/", {
    message,
    target_role: targetRole || null,
  });
  return res.data.reply;
}

export default client;