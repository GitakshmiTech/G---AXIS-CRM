//===========================================================================================
//    AUTH SERVICE (FRONTEND CLIENT)
//    Manages login API calls, token persistence, and authenticated user session
//===========================================================================================

import { apiClient } from './api';

/**
 * Log in user and persist session token and profile
 * @param {Object} credentials - { email, password, rememberMe }
 * @returns {Promise<Object>}
 */
export const loginUser = async ({ email, password, rememberMe = false }) => {
  const response = await apiClient('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  if (response.success && response.data?.token) {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('token', response.data.token);
    storage.setItem('user', JSON.stringify(response.data.user));

    // Also mirror to localStorage for easy multi-tab session
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }

  return response.data;
};

/**
 * Get current cached user from storage
 * @returns {Object|null}
 */
export const getCurrentUser = () => {
  const userJson = localStorage.getItem('user') || sessionStorage.getItem('user');
  if (!userJson) return null;
  try {
    return JSON.parse(userJson);
  } catch {
    return null;
  }
};

/**
 * Fetch fresh user profile from backend
 * @returns {Promise<Object>}
 */
export const fetchProfile = async () => {
  const response = await apiClient('/auth/me');
  return response.data;
};

/**
 * Fetch staff directory list for assignment dropdowns
 * @returns {Promise<Array>}
 */
export const fetchStaffDirectory = async () => {
  const response = await apiClient('/auth/staff');
  return response.data || [];
};

/**
 * Log out and clear stored session tokens
 */
export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
};

export default {
  loginUser,
  getCurrentUser,
  fetchProfile,
  fetchStaffDirectory,
  logoutUser,
};

