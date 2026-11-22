//==================================================================================================================
//    CENTRALIZED API CLIENT BASE SERVICE (RULE 5)
//==================================================================================================================

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const TEMPORARY_API_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwiZW1haWwiOiJhZG1pbkBnaXRha3NobWkuY29tIiwib3JnSWQiOiIxIiwib3JnQ29kZSI6IkdJVEFLU0hNSSIsImRiTmFtZSI6Im9yZ19naXRha3NobWkiLCJpYXQiOjE3OTUxNzQ4MDIsImV4cCI6MTc5NTc3OTYwMn0.gRM_IGof7EruS6R0PE8sGVcCCIXwk_ZBWmmMJvk1Fak';

/**
 * Common fetch wrapper for API interactions
 * @param {string} endpoint
 * @param {RequestInit} options
 * @returns {Promise<any>}
 */
export const apiClient = async (endpoint, options = {}) => {
  const { responseType, ...requestOptions } = options;
  const isFormData = typeof FormData !== 'undefined' && requestOptions.body instanceof FormData;
  const defaultHeaders = {
    ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
    Accept: 'application/json',
  };
  const savedToken = localStorage.getItem('gcrm_token');
  const isMockToken = !savedToken || savedToken === 'gcrm-mock-jwt-token' || savedToken.startsWith('token-');
  const token = isMockToken
    ? (import.meta.env.VITE_API_TOKEN || TEMPORARY_API_TOKEN)
    : savedToken;

  const config = {
    ...requestOptions,
    headers: {
      ...defaultHeaders,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const error = new Error(errorBody.error || errorBody.message || `API Error: ${response.status}`);
    error.status = response.status;
    error.data = errorBody;
    throw error;
  }

  if (responseType === 'blob') return response.blob();
  if (responseType === 'text') return response.text();
  return response.json();
};

