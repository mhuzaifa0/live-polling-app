import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({ baseURL: API_BASE });

export const createPollApi = (data) => api.post("/polls", data);
export const getPollApi = (slug) => api.get(`/polls/${slug}`);
export const votePollApi = (slug, optionIndex) =>
  api.post(`/polls/${slug}/vote`, { optionIndex });
