import axios from "axios";

function normalizeBase(raw?: string, fallback?: string) {
  const v = (raw ?? "").trim();
  const pick = v && v !== "undefined" && v !== "null" ? v : (fallback ?? "");
  return pick.replace(/\/+$/, "");
}

const DEV_DEFAULT = "http://localhost:10000";
const RAW = import.meta.env.VITE_API_BASE_URL as string | undefined;

const base = normalizeBase(
  RAW,
  import.meta.env.DEV ? DEV_DEFAULT : window.location.origin
);


const API_BASE = new URL(base);                 
const ADMIN_BASE = new URL(base);              
const ADMIN_HOST = ADMIN_BASE.host;

export const api = axios.create({ baseURL: `${API_BASE.href}api`.replace(/\/+$/, "") });
export const apiAdmin = axios.create({ baseURL: `${ADMIN_BASE.href}admin`.replace(/\/+$/, "") });

apiAdmin.interceptors.request.use((config) => {
  const url = new URL(config.url ?? "", config.baseURL ?? ADMIN_BASE.href);
  if (url.host === ADMIN_HOST) {
    const token = localStorage.getItem("adminToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

if (import.meta.env.DEV) {
  const ensureJson = (res: any) => {
    const ct = String(res?.headers?.["content-type"] ?? "");
    if (res.status === 200 && !ct.includes("application/json")) {
      return Promise.reject(
        new Error("Resposta não-JSON recebida. Verifique VITE_API_BASE_URL / baseURL do Axios.")
      );
    }
    return res;
  };
  api.interceptors.response.use(ensureJson);
  apiAdmin.interceptors.response.use(ensureJson);
}
