//===========================================================================================
//    AUTHENTICATED PROFILE AND PASSWORD API
//    Calls real backend. Falls back to local mock resolution when server is unreachable.
// ===========================================================================================
import { apiClient } from './api';
import { resolveUserByCredentials, DEFAULT_USERS } from '../constants/authConstants';

const unwrap = (response) => response?.data ?? response;
const getPayload = (response) => {
  const value = unwrap(response);
  return value?.data ?? value;
};

/** Load the authenticated employee profile and read-only role/manager details. */
export const fetchProfile = async () => getPayload(await apiClient('/auth/profile'));

/** Save only profile fields permitted by the self-service API. */
export const saveProfile = async (values) => getPayload(await apiClient('/auth/profile', {
  method: 'PATCH',
  body: JSON.stringify({ name: values.name, phone: values.phone }),
}));

/** Verify the current password and request a secure password change. */
export const updatePassword = async (values) => apiClient('/auth/change-password', {
  method: 'PATCH',
  body: JSON.stringify(values),
});

/** Authenticate against the tenant API and normalize the returned role for app routing.
 *  Falls back to email-based mock resolution when the backend is not reachable. */
export const authenticate = async ({ email, password }) => {
  try {
    const response = await apiClient('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ domain: import.meta.env.VITE_TENANT_DOMAIN || 'gitakshmi', email, password }),
    });
    const data = getPayload(response);
    const roleName = data.user?.roleName || '';
    const role = /admin/i.test(roleName) ? 'admin' : /sales|manager/i.test(roleName) ? 'sales' : 'bde';
    return {
      role,
      token: data.token,
      user: {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone || '',
        employeeCode: data.user.employeeCode || '',
        roleId: data.user.roleId || '',
        role,
        roleLabel: roleName,
        designation: roleName,
        avatar: '',
      },
    };
  } catch (err) {
    // ── Mock / offline fallback ──────────────────────────────────────────────────────────
    // When no backend is running, resolve the user from the email prefix so the UI
    // remains fully testable without a server.
    if (err?.status === undefined || err?.status === 0 || err?.message?.includes('fetch')) {
      const resolved = resolveUserByCredentials(email);
      return {
        role: resolved.role,
        token: 'gcrm-mock-jwt-token',
        user: resolved.user,
      };
    }
    throw err;
  }
};
