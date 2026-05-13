/**
 * Access Token Helper
 * @deprecated Use getAccessToken from auth_helper.jsx instead
 */
import { getAccessToken as getToken } from '../auth_helper';

async function getAccessToken() {
  const token = getToken();
  return token ? `Bearer ${token}` : null;
}

export default getAccessToken;
