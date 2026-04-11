import { NETWORK_URL } from "./config";

const api = axios.create({
  baseURL: NETWORK_URL,
});

api.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("tbzToken")
      : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
