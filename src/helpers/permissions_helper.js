import { getStoredAuthUser } from './auth_helper';

const getPermissions = () => {
  try {
    const value = localStorage.getItem('userPermissions');
    return value ? JSON.parse(value) : [];
  } catch { return []; }
};

export const isUserAdmin = () =>
  String(getStoredAuthUser()?.user?.role || '').toLowerCase() === 'admin';

export const getModulePermissionSet = (moduleKey) =>
  getPermissions().flatMap((group) => group?.modules || [])
    .find((item) => item?.module === moduleKey)?.permissions || {};

export const canViewModule = (moduleKey) =>
  isUserAdmin() || getPermissions().flatMap((group) => group?.modules || [])
    .some((item) => item?.module === moduleKey && item.enabled && item.permissions?.view);
