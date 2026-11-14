//===========================================================================================
//    LEADS API SERVICE (RULE 5)
//    Encapsulates all backend HTTP interactions for Leads lifecycle operations
//===========================================================================================

import { apiClient } from './api';

/**
 * Fetch paginated, filtered, and searchable leads list
 * @param {object} params - { page, limit, search, stage, priority, source }
 * @returns {Promise<{ leads: Array, totalEntries: number, currentPage: number, pageSize: number }>}
 */
export const fetchLeads = async (params = {}) => {
  const query = new URLSearchParams();

  if (params.page) query.append('page', params.page);
  if (params.limit) query.append('limit', params.limit);
  if (params.search && params.search.trim()) query.append('search', params.search.trim());
  if (params.stage && params.stage !== 'All') query.append('stage', params.stage);
  if (params.priority && params.priority !== 'All') query.append('priority', params.priority);
  if (params.source && params.source !== 'All') query.append('source', params.source);

  const queryString = query.toString() ? `?${query.toString()}` : '';
  const response = await apiClient(`/leads${queryString}`, { method: 'GET' });
  return response.data;
};

/**
 * Fetch single lead details by ID
 * @param {number|string} id
 * @returns {Promise<object>}
 */
export const fetchLeadById = async (id) => {
  const response = await apiClient(`/leads/${id}`, { method: 'GET' });
  return response.data;
};

/**
 * Create a new enterprise lead
 * @param {object} leadData
 * @returns {Promise<object>} Created lead object
 */
export const createLead = async (leadData) => {
  const response = await apiClient('/leads', {
    method: 'POST',
    body: JSON.stringify(leadData),
  });
  return response.data;
};

/**
 * Update an existing lead
 * @param {number|string} id
 * @param {object} updateData
 * @returns {Promise<object>} Updated lead object
 */
export const updateLead = async (id, updateData) => {
  const response = await apiClient(`/leads/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updateData),
  });
  return response.data;
};

/**
 * Convert lead into Account, Contact, and Deal
 * @param {number|string} id
 * @param {object} dealData
 * @returns {Promise<object>}
 */
export const convertLead = async (id, dealData) => {
  const response = await apiClient(`/leads/${id}/convert`, {
    method: 'POST',
    body: JSON.stringify(dealData),
  });
  return response.data;
};

/**
 * Pre-save deduplication check by email or phone
 * @param {object} payload - { email, phone, companyName }
 * @returns {Promise<{ isDuplicate: boolean, matchedLeads: Array, matchedContacts: Array }>}
 */
export const checkDuplicateLead = async (payload) => {
  const response = await apiClient('/leads/check-duplicate', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return response.data;
};

/**
 * Fetch dynamic master dropdown options for Leads and Deals
 * @returns {Promise<object>}
 */
export const fetchLeadOptions = async () => {
  const response = await apiClient('/masters/lead-options', { method: 'GET' });
  return response.data;
};

