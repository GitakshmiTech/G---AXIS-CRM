//==================================================================================================================
//    CENTRALIZED API CLIENT BASE SERVICE (RULE 5)
//==================================================================================================================

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Common fetch wrapper for API interactions
 * @param {string} endpoint
 * @param {RequestInit} options
 * @returns {Promise<any>}
 */
export const apiClient = async (endpoint, options = {}) => {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const error = new Error(errorBody.message || `API Error: ${response.status}`);
    error.status = response.status;
    error.data = errorBody;
    throw error;
  }

  return response.json();
};

