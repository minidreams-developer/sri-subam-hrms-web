import axios from "axios";

const ACCESS_TOKEN_KEY = "acesstoken";
const AUTH_USER_KEY = "authUser";
const REFRESH_COOKIE = "refreshToken";
const THREE_DAYS_SECONDS = 3 * 24 * 60 * 60;

export const getRefreshToken = () => {
  const cookie = document.cookie.split("; ").find((item) => item.startsWith(`${REFRESH_COOKIE}=`));
  return cookie ? decodeURIComponent(cookie.split("=").slice(1).join("=")) : null;
};

export const setRefreshToken = (token) => {
  if (!token) return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${REFRESH_COOKIE}=${encodeURIComponent(token)}; Max-Age=${THREE_DAYS_SECONDS}; Path=/; SameSite=Strict${secure}`;
};

export const clearAuthSession = () => {
  [ACCESS_TOKEN_KEY, AUTH_USER_KEY, "userData", "token", "adminUser", "authToken", "userPermissions"].forEach((key) => localStorage.removeItem(key));
  document.cookie = `${REFRESH_COOKIE}=; Max-Age=0; Path=/; SameSite=Strict`;
};

export const getStoredSession = () => {
  try {
    const value = localStorage.getItem(AUTH_USER_KEY);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY) || getStoredSession()?.tokens?.access?.token || null;

export const storeAuthTokens = (responseData, existingUserData = responseData) => {
  const payload = responseData?.data || responseData;
  const tokens = payload?.tokens || payload;
  const accessToken = tokens?.access?.token || tokens?.accessToken || payload?.accessToken;
  if (!accessToken) return null;

  const refreshToken = tokens?.refresh?.token || tokens?.refreshToken || payload?.refreshToken;
  const existingSession = existingUserData?.data || existingUserData || {};
  const safeUser = { ...(payload?.user || existingSession?.user || {}) };
  delete safeUser.password;

  const safeTokens = { ...tokens };
  if (safeTokens.refresh) {
    safeTokens.refresh = { ...safeTokens.refresh };
    delete safeTokens.refresh.token;
  }

  const storedSession = { ...payload, user: safeUser, tokens: safeTokens };
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(storedSession));
  localStorage.setItem("userData", JSON.stringify(storedSession));

  const normalizedRole = String(safeUser.role || "").trim().replace(/[\s_-]+/g, "").toLowerCase();
  const permissions = (safeUser.permissions || [])
    .filter((permission) => typeof permission === "string" || permission?.enabled === true)
    .map((permission) => typeof permission === "string" ? permission : permission?.value || permission?.name)
    .filter(Boolean);
  localStorage.setItem("adminUser", JSON.stringify({ ...safeUser, id: safeUser._id || safeUser.id, accessRole: normalizedRole, permissions }));

  setRefreshToken(refreshToken);
  return accessToken;
};

export const refreshAuthSession = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;
  const response = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/v1/auth/refresh-tokens`,
    { refreshToken },
    { headers: { Accept: "application/json" } },
  );
  return storeAuthTokens(response.data, getStoredSession());
};
