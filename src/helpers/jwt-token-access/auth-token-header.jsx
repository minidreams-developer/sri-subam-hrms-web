/**
 * Auth Token Header Helper
 * @deprecated Use the axios interceptors in api_helper.jsx instead
 * This file is kept for backward compatibility
 */
import { getAccessToken, isAccessTokenExpired, handleTokenRefresh } from '../auth_helper';

const authHeader = async () => {
  // Check if token is expired
  if (isAccessTokenExpired()) {
    // Try to refresh the token
    await handleTokenRefresh();
  }

  // Get the current access token
  const token = getAccessToken();
  
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  
  return {};
};

export default authHeader;
