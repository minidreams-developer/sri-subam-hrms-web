import axios from "axios";
import {
  getAccessToken,
  handleTokenRefresh,
  clearAuthData,
  isAccessTokenExpired,
} from "./auth_helper";

// API base URL
const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

// Create axios instance
const axiosApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Track if we're currently refreshing to prevent multiple refresh calls
let isRefreshing = false;
let failedQueue = [];

/**
 * Process queued requests after token refresh
 */
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// ==================== Request Interceptor ====================
axiosApi.interceptors.request.use(
  async (config) => {
    // Skip auth header for login and refresh endpoints
    const isAuthEndpoint = 
      config.url?.includes('/auth/login') || 
      config.url?.includes('/auth/refresh-tokens');

    if (isAuthEndpoint) {
      return config;
    }

    // Check if token is expired before making request
    if (isAccessTokenExpired()) {
      try {
        const newToken = await handleTokenRefresh();
        if (newToken) {
          config.headers.Authorization = `Bearer ${newToken}`;
        }
      } catch (error) {
        console.error('Token refresh failed in request interceptor:', error);
        return Promise.reject(error);
      }
    } else {
      // Use current valid token
      const accessToken = getAccessToken();
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==================== Response Interceptor ====================
axiosApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is not 401 or request has already been retried, reject immediately
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // If we're already refreshing, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosApi(originalRequest);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const newToken = await handleTokenRefresh();

      if (newToken) {
        // Update the failed request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        
        // Process all queued requests
        processQueue(null, newToken);
        
        // Retry the original request
        return axiosApi(originalRequest);
      } else {
        // Refresh failed, clear auth and redirect
        processQueue(new Error('Token refresh failed'), null);
        clearAuthData();
        window.location.href = "/login";
        return Promise.reject(error);
      }
    } catch (refreshError) {
      processQueue(refreshError, null);
      clearAuthData();
      window.location.href = "/login";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

// ==================== API Helper Functions ====================

/**
 * GET request
 */
export async function get(url, config = {}) {
  return await axiosApi
    .get(url, { ...config })
    .then((response) => response.data);
}

/**
 * POST request
 */
export async function post(url, data, config = {}) {
  return axiosApi
    .post(url, data, { ...config })
    .then((response) => response.data);
}

/**
 * POST request with FormData (for file uploads)
 */
export async function postFormData(url, formData, config = {}, onProgress) {
  const uploadConfig = {
    ...config,
    headers: {
      "Content-Type": "multipart/form-data",
      ...config.headers,
    },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        if (onProgress) onProgress(percentCompleted);
      }
    },
  };

  return axiosApi
    .post(url, formData, uploadConfig)
    .then((response) => response.data);
}

/**
 * PUT request
 */
export async function put(url, data, config = {}) {
  return axiosApi
    .put(url, data, { ...config })
    .then((response) => response.data);
}

/**
 * PATCH request
 */
export async function patch(url, data, config = {}) {
  return axiosApi
    .patch(url, data, { ...config })
    .then((response) => response.data);
}

/**
 * DELETE request
 */
export async function del(url, config = {}) {
  return await axiosApi
    .delete(url, { ...config })
    .then((response) => response.data);
}

export default axiosApi;
