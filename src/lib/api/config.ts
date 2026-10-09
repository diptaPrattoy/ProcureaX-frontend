const FALLBACK_API_BASE_URL = "https://procurex-backend-du0l.onrender.com/api/v1";

export function getApiBaseUrl() {
  const configuredUrl = process.env.API_BASE_URL?.trim();
  const baseUrl = configuredUrl || FALLBACK_API_BASE_URL;

  return `${baseUrl.replace(/\/+$/, "")}/`;
}
