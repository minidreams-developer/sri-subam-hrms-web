/**
 * JWT Authentication Helper
 * Handles complete authentication flow including token management and refresh
 */

const AUTH_USER_KEY = 'authUser';

// ==================== Storage Functions ====================

/**
 * Get complete auth data from localStorage
 * @returns {Object|null} Complete auth object with user and tokens
 */
export const getCompleteAuthData = () => {
  try {
    const authUser = localStorage.getItem(AUTH_USER_KEY);
    return authUser ? JSON.parse(authUser) : null;
  } catch (error) {
    console.error('Error parsing auth data:', error);
    return null;
  }
};

/**
 * Store complete auth data in localStorage
 * @param {Object} authData - Complete auth response { user, tokens }
 * @returns {boolean} Success status
 */
export const setStoredAuthUser = (authData) => {
  try {
    if (!authData?.tokens?.access?.token) {
      console.error('Invalid auth data: missing access token');
      return false;
    }
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authData));
    return true;
  } catch (error) {
    console.error('Error storing auth data:', error);
    return false;
  }
};

/**
 * Clear all auth data from localStorage
 */
export const clearAuthData = () => {
  localStorage.removeItem(AUTH_USER_KEY);
};

// ==================== Token Access Functions ====================

/**
 * Get access token
 * @returns {string|null} Access token or null
 */
export const getAccessToken = () => {
  const authData = getCompleteAuthData();
  return authData?.tokens?.access?.token || null;
};

/**
 * Get refresh token
 * @returns {string|null} Refresh token or null
 */
export const getRefreshToken = () => {
  const authData = getCompleteAuthData();
  return authData?.tokens?.refresh?.token || null;
};

/**
 * Get user data
 * @returns {Object|null} User object or null
 */
export const getAuthUser = () => {
  const authData = getCompleteAuthData();
  return authData?.user || null;
};

/**
 * Get stored auth user data (alias for backward compatibility)
 * @returns {Object|null} Complete auth object
 */
export const getStoredAuthUser = getCompleteAuthData;

// ==================== Token Validation Functions ====================

/**
 * Check if access token is expired
 * @returns {boolean} True if expired or missing
 */
export const isAccessTokenExpired = () => {
  const authData = getCompleteAuthData();
  
  if (!authData?.tokens?.access?.expires) {
    return true;
  }

  const expiryTime = new Date(authData.tokens.access.expires).getTime();
  const currentTime = Date.now();
  
  // Consider token expired 30 seconds before actual expiry for safety
  const bufferTime = 30 * 1000;
  return expiryTime - bufferTime <= currentTime;
};

/**
 * Check if user is authenticated with valid token
 * @returns {boolean} True if authenticated with valid token
 */
export const isAuthenticated = () => {
  const accessToken = getAccessToken();
  if (!accessToken) return false;
  
  return !isAccessTokenExpired();
};

// ==================== Token Refresh Functions ====================

let isRefreshing = false;
let refreshSubscribers = [];

/**
 * Subscribe to token refresh completion
 * @param {Function} callback - Callback to execute after refresh
 */
const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

/**
 * Notify all subscribers that token refresh is complete
 * @param {string} token - New access token
 */
const onTokenRefreshed = (token) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

/**
 * Handle token refresh with proper locking to prevent multiple simultaneous refreshes
 * @returns {Promise<string|null>} New access token or null on failure
 */
export const handleTokenRefresh = async () => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    console.error('No refresh token available');
    clearAuthData();
    return null;
  }

  // If already refreshing, wait for the current refresh to complete
  if (isRefreshing) {
    return new Promise((resolve) => {
      subscribeTokenRefresh((token) => {
        resolve(token);
      });
    });
  }

  isRefreshing = true;

  try {
    // Import axios here to avoid circular dependency
    const axios = (await import('axios')).default;
    const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

    const response = await axios.post(
      `${API_URL}/v1/auth/refresh-tokens`,
      { refreshToken },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data?.tokens) {
      const authData = getCompleteAuthData();
      const updatedAuthData = {
        ...authData,
        tokens: response.data.tokens,
      };

      setStoredAuthUser(updatedAuthData);
      const newAccessToken = response.data.tokens.access.token;
      
      // Notify all waiting requests
      onTokenRefreshed(newAccessToken);
      
      return newAccessToken;
    }

    throw new Error('Invalid refresh response');
  } catch (error) {
    console.error('Token refresh failed:', error);
    clearAuthData();
    onTokenRefreshed(null);
    
    // Redirect to login
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    
    return null;
  } finally {
    isRefreshing = false;
  }
};

// ==================== Logout Function ====================

/**
 * Logout user and clear all auth data
 * @param {boolean} redirect - Whether to redirect to login page
 */
export const logout = (redirect = true) => {
  clearAuthData();
  
  if (redirect && typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};
