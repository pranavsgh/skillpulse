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

export function sendChatMessage(message, targetRole) {
  // Todo Mutha: POST /chat/ with { message, target_role }
  throw new Error("not implemented");
}

export default client;
