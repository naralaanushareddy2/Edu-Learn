import axios from "axios";
import initialDb from "@data/db.json";

export const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const STORAGE_KEY = "edulearn_db_fallback";

// Initialize localStorage fallback DB if not present
const getFallbackDb = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn("Error reading fallback storage:", err);
  }

  const initial = {
    users: initialDb.users || [],
    enrollments: initialDb.enrollments || [],
    wishlist: initialDb.wishlist || [],
    certificates: initialDb.certificates || []
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  } catch (err) {
    console.warn("Error initializing fallback storage:", err);
  }

  return initial;
};

const saveFallbackDb = (db) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch (err) {
    console.warn("Error saving fallback storage:", err);
  }
};

const parseUrlParts = (url) => {
  const fullUrl = url.startsWith("http") ? url : `${API_URL}${url.startsWith("/") ? "" : "/"}${url}`;
  try {
    const parsed = new URL(fullUrl);
    const pathname = parsed.pathname.replace(/^\/+/, "");
    const segments = pathname.split("/");
    const resource = segments[0] || "";
    const id = segments[1] ? decodeURIComponent(segments[1]) : null;
    const params = {};
    parsed.searchParams.forEach((val, key) => {
      params[key] = val;
    });
    return { resource, id, params };
  } catch {
    const [pathPart, queryPart] = url.replace(API_URL, "").split("?");
    const segments = pathPart.replace(/^\/+/, "").split("/");
    const resource = segments[0] || "";
    const id = segments[1] ? decodeURIComponent(segments[1]) : null;
    const params = {};
    if (queryPart) {
      new URLSearchParams(queryPart).forEach((val, key) => {
        params[key] = val;
      });
    }
    return { resource, id, params };
  }
};

// Fallback handlers for offline / static production mode
const handleFallbackRequest = (method, url, data) => {
  const { resource, id, params } = parseUrlParts(url);
  const db = getFallbackDb();
  const collection = db[resource] || [];

  if (method === "get") {
    if (id) {
      const item = collection.find((item) => String(item.id) === String(id));
      if (!item) {
        return Promise.reject(new Error(`Item with id ${id} not found`));
      }
      return Promise.resolve({ data: item, status: 200 });
    }

    let filtered = [...collection];
    Object.keys(params).forEach((key) => {
      const expected = params[key];
      filtered = filtered.filter(
        (item) => String(item[key]) === String(expected)
      );
    });

    return Promise.resolve({ data: filtered, status: 200 });
  }

  if (method === "post") {
    const newItem = {
      ...data,
      id: data?.id || `local_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
    };
    db[resource] = [...collection, newItem];
    saveFallbackDb(db);
    return Promise.resolve({ data: newItem, status: 201 });
  }

  if (method === "patch" || method === "put") {
    if (!id) {
      return Promise.reject(new Error("Missing ID for update"));
    }
    let updatedItem = null;
    db[resource] = collection.map((item) => {
      if (String(item.id) === String(id)) {
        updatedItem = { ...item, ...data };
        return updatedItem;
      }
      return item;
    });
    saveFallbackDb(db);
    return Promise.resolve({ data: updatedItem || data, status: 200 });
  }

  if (method === "delete") {
    if (!id) {
      return Promise.reject(new Error("Missing ID for delete"));
    }
    db[resource] = collection.filter((item) => String(item.id) !== String(id));
    saveFallbackDb(db);
    return Promise.resolve({ data: {}, status: 200 });
  }

  return Promise.reject(new Error(`Unsupported method: ${method}`));
};

const axiosInstance = axios.create({
  timeout: 2500
});

export const api = {
  get: async (url, config) => {
    const targetUrl = url.startsWith("http") ? url : `${API_URL}${url.startsWith("/") ? "" : "/"}${url}`;
    try {
      const response = await axiosInstance.get(targetUrl, config);
      return response;
    } catch (error) {
      if (!error.response || error.code === "ECONNABORTED" || error.code === "ERR_NETWORK") {
        console.info(`[EduLearn API] Server at ${API_URL} unreachable, serving via resilient local store.`);
        return handleFallbackRequest("get", targetUrl);
      }
      throw error;
    }
  },

  post: async (url, data, config) => {
    const targetUrl = url.startsWith("http") ? url : `${API_URL}${url.startsWith("/") ? "" : "/"}${url}`;
    try {
      const response = await axiosInstance.post(targetUrl, data, config);
      return response;
    } catch (error) {
      if (!error.response || error.code === "ECONNABORTED" || error.code === "ERR_NETWORK") {
        console.info(`[EduLearn API] Server at ${API_URL} unreachable, saving to resilient local store.`);
        return handleFallbackRequest("post", targetUrl, data);
      }
      throw error;
    }
  },

  patch: async (url, data, config) => {
    const targetUrl = url.startsWith("http") ? url : `${API_URL}${url.startsWith("/") ? "" : "/"}${url}`;
    try {
      const response = await axiosInstance.patch(targetUrl, data, config);
      return response;
    } catch (error) {
      if (!error.response || error.code === "ECONNABORTED" || error.code === "ERR_NETWORK") {
        console.info(`[EduLearn API] Server at ${API_URL} unreachable, updating in resilient local store.`);
        return handleFallbackRequest("patch", targetUrl, data);
      }
      throw error;
    }
  },

  put: async (url, data, config) => {
    const targetUrl = url.startsWith("http") ? url : `${API_URL}${url.startsWith("/") ? "" : "/"}${url}`;
    try {
      const response = await axiosInstance.put(targetUrl, data, config);
      return response;
    } catch (error) {
      if (!error.response || error.code === "ECONNABORTED" || error.code === "ERR_NETWORK") {
        console.info(`[EduLearn API] Server at ${API_URL} unreachable, updating in resilient local store.`);
        return handleFallbackRequest("put", targetUrl, data);
      }
      throw error;
    }
  },

  delete: async (url, config) => {
    const targetUrl = url.startsWith("http") ? url : `${API_URL}${url.startsWith("/") ? "" : "/"}${url}`;
    try {
      const response = await axiosInstance.delete(targetUrl, config);
      return response;
    } catch (error) {
      if (!error.response || error.code === "ECONNABORTED" || error.code === "ERR_NETWORK") {
        console.info(`[EduLearn API] Server at ${API_URL} unreachable, deleting from resilient local store.`);
        return handleFallbackRequest("delete", targetUrl);
      }
      throw error;
    }
  }
};

export default api;
