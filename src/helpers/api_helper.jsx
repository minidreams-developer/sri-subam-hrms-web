import axios from "axios";
import {
  clearAuthSession,
  getAccessToken,
  getRefreshToken,
  refreshAuthSession,
} from "./authSession";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
  headers: { Accept: "application/json" },
});

let activeRequestCount = 0;
let refreshPromise = null;
const loadingListeners = new Set();

const notifyLoadingListeners = () => {
  const isLoading = activeRequestCount > 0;
  loadingListeners.forEach((listener) => listener(isLoading));
};

const finishRequest = (config) => {
  if (!config?._trackGlobalLoading || config._loadingFinished) return;
  config._loadingFinished = true;
  activeRequestCount = Math.max(0, activeRequestCount - 1);
  notifyLoadingListeners();
};

const getNewAccessToken = () => {
  if (!refreshPromise) {
    refreshPromise = refreshAuthSession().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
};

export const subscribeApiLoading = (listener) => {
  loadingListeners.add(listener);
  listener(activeRequestCount > 0);
  return () => loadingListeners.delete(listener);
};

api.interceptors.request.use(
  (config) => {
    config._trackGlobalLoading = config.skipGlobalLoading !== true;
    config._loadingFinished = false;
    if (config._trackGlobalLoading) {
      activeRequestCount += 1;
      notifyLoadingListeners();
    }

    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    if (import.meta.env.DEV) console.debug("API request", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => {
    finishRequest(response.config);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    finishRequest(originalRequest);

    const isLoginRequest = originalRequest?.url?.includes("/auth/login");
    const isRefreshRequest = originalRequest?.url?.includes("/auth/refresh-tokens");
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !isLoginRequest &&
      !isRefreshRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      if (getRefreshToken()) {
        try {
          const accessToken = await getNewAccessToken();
          if (accessToken) {
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          if (import.meta.env.DEV) console.error("Token refresh failed", refreshError);
        }
      }

      clearAuthSession();
      if (window.location.pathname !== "/") window.location.replace("/");
    }

    if (import.meta.env.DEV) console.error("API error", error.response?.status, error.response?.data);
    return Promise.reject(error);
  },
);

export default api;
