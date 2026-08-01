import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { apiBaseUrl } from "@/lib/config";

let cachedAccessToken: string | null = null;
let cachedAccessTokenExpiresAt = 0;
let tokenRequestInFlight: Promise<string | null> | null = null;

function decodeJwtExpiration(token: string): number {
  const parts = token.split(".");
  if (parts.length !== 3) {
    console.warn("Auth0 access token is not a signed three-part JWT. Check AUTH0_AUDIENCE.");
    return Date.now() + 60_000;
  }

  try {
    const base64 = parts[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(parts[1].length / 4) * 4, "=");
    const payload = JSON.parse(atob(base64)) as { exp?: number };
    return typeof payload.exp === "number" ? payload.exp * 1000 : Date.now() + 60_000;
  } catch (error) {
    console.warn("Failed to decode JWT expiration", error);
    return Date.now() + 60_000;
  }
}

async function getAccessTokenForRequest(): Promise<string | null> {
  if (typeof window === "undefined") {
    return null;
  }

  if (cachedAccessToken && Date.now() < cachedAccessTokenExpiresAt - 30_000) {
    return cachedAccessToken;
  }

  if (!tokenRequestInFlight) {
    tokenRequestInFlight = fetch("/api/access-token", {
      credentials: "include",
      cache: "no-store",
    })
      .then(async (response) => {
        if (!response.ok) {
          return null;
        }

        const data = (await response.json()) as { accessToken?: string };
        const token = data.accessToken?.trim();
        if (!token) {
          return null;
        }

        cachedAccessToken = token;
        cachedAccessTokenExpiresAt = decodeJwtExpiration(token);
        return token;
      })
      .catch((error) => {
        console.error("Failed to fetch access token", error);
        return null;
      })
      .finally(() => {
        tokenRequestInFlight = null;
      });
  }

  return tokenRequestInFlight;
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: apiBaseUrl,
  timeout: 15_000,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use(async (config) => {
  const token = await getAccessTokenForRequest();
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      cachedAccessToken = null;
      cachedAccessTokenExpiresAt = 0;
      window.location.assign("/auth/login");
    }
    return Promise.reject(error);
  },
);

export const apiClient = {
  get: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    axiosInstance.get<T>(url, config),
  post: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    axiosInstance.post<T>(url, data, config),
  put: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    axiosInstance.put<T>(url, data, config),
  delete: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    axiosInstance.delete<T>(url, config),
};
