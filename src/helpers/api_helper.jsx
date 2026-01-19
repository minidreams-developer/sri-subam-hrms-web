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
// const API_URL = import.meta.env.VITE_BASE_URL;
const API_URL = import.meta.env.VITE_BASE_URL_LOCAL;

const axiosApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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
    .post(url, { ...data }, { ...config, headers })
    .then((response) => response.data);
}

export async function postFormData(url, formData, config = {}, onProgress) {
  // Set appropriate headers for multipart/form-data
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

export async function del(url, config = {}) {
  return await axiosApi
    .delete(url, { ...config })
    .then((response) => response.data);
}

//-------------------------------------------------------------------------------------
