import axios from "axios";
// import { refreshToken } from "./jwt-token-access/accessToken";
// import getAccessToken from "./jwt-token-access/accessToken";
import {
  clearAuthData,
  getStoredAuthUser,
  handleTokenRefresh,
} from "./auth_helper";

//calling refreshAccessToken checks the expiration. if it is expired get a new token
// refreshToken();
//pass new generated access token here
// const token = getAccessToken();
// console.log("token", token);

//apply base url for axios
const API_URL = import.meta.env.VITE_API_BASE_URL ;

const axiosApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let activeRequestCount = 0;
const loadingListeners = new Set();

const notifyLoadingListeners = () => {
  const isLoading = activeRequestCount > 0;
  loadingListeners.forEach((listener) => listener(isLoading));
};

const startRequest = () => {
  activeRequestCount += 1;
  notifyLoadingListeners();
};

const finishRequest = () => {
  activeRequestCount = Math.max(0, activeRequestCount - 1);
  notifyLoadingListeners();
};

export const subscribeApiLoading = (listener) => {
  loadingListeners.add(listener);
  listener(activeRequestCount > 0);
  return () => loadingListeners.delete(listener);
};

axiosApi.interceptors.request.use(
  async (config) => {
    const authUser = getStoredAuthUser();
    const accessToken = authUser?.tokens?.access?.token;

    // Set the token in the request headers
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const refreshSuccess = await handleTokenRefresh();

        if (refreshSuccess) {
          // Retry the original request with new token
          const authUser = getStoredAuthUser();
          const newAccessToken = authUser?.tokens?.access?.token;

          if (newAccessToken) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }

          return axiosApi(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        clearAuthData();
        window.location.href = "/"; // Redirect to login
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Keep a single global loading state in sync with every request made through
// this API client. The counter handles multiple simultaneous requests.
axiosApi.interceptors.request.use(
  (config) => {
    config._trackGlobalLoading = config.skipGlobalLoading !== true;
    if (config._trackGlobalLoading) startRequest();
    return config;
  },
  (error) => Promise.reject(error)
);

axiosApi.interceptors.response.use(
  (response) => {
    if (response.config?._trackGlobalLoading) finishRequest();
    return response;
  },
  (error) => {
    if (error.config?._trackGlobalLoading) finishRequest();
    return Promise.reject(error);
  }
);

export async function get(url, config = {}) {
  return await axiosApi
    .get(url, { ...config })
    .then((response) => response.data);
}

export async function post(url, data, config = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...config.headers,
  };
  return axiosApi
    .post(url, data, { ...config, headers })
    .then((response) => response.data);
}

export async function postFormData(url, formData, config = {}, onProgress) {
  // Override the axios instance's application/json default. Otherwise axios
  // serializes FormData as JSON and the API receives malformed array/object
  // values instead of multipart fields and files.
  config = {
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

  // Make the POST request using axios
  return axiosApi.post(url, formData, config).then((response) => response.data);
}

export async function put(url, data, config = {}) {
  return axiosApi
    .put(url, { ...data }, { ...config })
    .then((response) => response.data);
}

export async function patch(url, data, config = {}) {
  return axiosApi
    .patch(url, { ...data }, { ...config })
    .then((response) => response.data);
}

export async function patchFormData(url, formData, config = {}, onProgress) {
  return axiosApi
    .patch(url, formData, {
      ...config,
      headers: {
        "Content-Type": "multipart/form-data",
        ...config.headers,
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          onProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
        }
      },
    })
    .then((response) => response.data);
}

export async function del(url, config = {}) {
  return await axiosApi
    .delete(url, { ...config })
    .then((response) => response.data);
}

//-------------------------------------------------------------------------------------
