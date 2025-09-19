export const API_CONFIG = {
  BASE_URL:
    (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080") + "/api/v1",
  TIMEOUT: 10000,
};

if (!import.meta.env.VITE_API_BASE_URL) {
  console.warn("VITE_API_BASE_URL is not defined, using fallback localhost");
}
