const API_BASE_URL = "http://localhost:3000";

async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  };

  if (window.FirebaseAuth?.auth.currentUser) {
    const token = await window.FirebaseAuth.auth.currentUser.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.body && typeof config.body !== "string") {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);
  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message = data?.message || data || "Request failed";
    throw new Error(message);
  }

  return data;
}

const api = {
  baseURL: API_BASE_URL,
  categories: `${API_BASE_URL}/api/categories`,
  products: `${API_BASE_URL}/api/products`,

  get(endpoint, options = {}) {
    return apiRequest(endpoint, { ...options, method: "GET" });
  },

  post(endpoint, body, options = {}) {
    return apiRequest(endpoint, { ...options, method: "POST", body });
  },

  put(endpoint, body, options = {}) {
    return apiRequest(endpoint, { ...options, method: "PUT", body });
  },

  delete(endpoint, options = {}) {
    return apiRequest(endpoint, { ...options, method: "DELETE" });
  },
};

if (typeof window !== "undefined") {
  window.API = api;
  window.api = api;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = api;
}

if (typeof globalThis !== "undefined") {
  globalThis.API_BASE_URL = API_BASE_URL;
}
