//===========================================================================================
//    MASTERS API SERVICE (RULE 5)
//    Encapsulates all backend HTTP interactions for Master lookups and dropdown options
//===========================================================================================

import { apiClient } from './api';

/**
 * Fetch dynamic master dropdown options for Leads and Deals
 * (Statuses/Stages, Sources, Industries, Products, Staff, Priorities, Employee Scales)
 * @returns {Promise<Object>}
 */
export const fetchLeadOptions = async () => {
  const response = await apiClient('/masters/lead-options', { method: 'GET' });
  return response.data;
};

export default {
  fetchLeadOptions,
};

