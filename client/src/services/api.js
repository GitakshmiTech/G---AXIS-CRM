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
  const { responseType, ...requestOptions } = options;
  const isFormData = typeof FormData !== 'undefined' && requestOptions.body instanceof FormData;
  const defaultHeaders = {
    ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
    Accept: 'application/json',
  };
  const token = localStorage.getItem('accessToken');

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
    let msg = typeof errorBody.error === 'string'
      ? errorBody.error
      : (errorBody.message || (Array.isArray(errorBody.error) && errorBody.error[0]?.message));
    if (!msg) {
      if (response.status === 502) {
        msg = 'Backend service is unreachable (502).';
      } else if (response.status === 503) {
        msg = 'Service temporarily unavailable (503).';
      } else if (response.status === 504) {
        msg = 'Gateway timeout (504).';
      } else {
        msg = `Request failed (${response.status})`;
      }
    }
    const error = new Error(typeof msg === 'string' ? msg : JSON.stringify(msg));
    error.status = response.status;
    error.data = errorBody;
    throw error;
  }

  if (responseType === 'blob') return response.blob();
  if (responseType === 'text') return response.text();
  return response.json();
};

