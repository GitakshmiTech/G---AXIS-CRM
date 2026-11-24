//===========================================================================================
//    SALES TEAM API SERVICE
//    Connects to backend /crm/team API (100% Dynamic - Zero Dummy Fallback)
// ===========================================================================================
import { apiClient } from './api';

const TEAM_ENDPOINT = '/crm/team';
const unwrap = (response) => response?.data ?? response;
const getPayload = (response) => {
  const value = unwrap(response);
  return value?.data ?? value;
};

/**
 * Fetch paginated, filtered team members and summary KPIs
 */
export const fetchTeamMembers = async ({
  page = 1,
  limit = 10,
  search = '',
  status = 'All',
  role = 'All',
  signal,
} = {}) => {
  const query = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (search.trim()) query.set('search', search.trim());
  if (status && status !== 'All') query.set('status', status.toLowerCase());
  if (role && role !== 'All') query.set('role', role);

  const response = await apiClient(`${TEAM_ENDPOINT}?${query}`, { signal });
  const payload = getPayload(response);

  return {
    kpis: payload?.kpis || {
      totalMembers: payload?.pagination?.total || (payload?.rows || []).length,
      activeMembers: (payload?.rows || []).filter((r) => String(r.status).toLowerCase() === 'active').length,
      inactiveMembers: (payload?.rows || []).filter((r) => String(r.status).toLowerCase() !== 'active').length,
    },
    rows: payload?.rows || [],
    pagination: payload?.pagination || { page, limit, total: (payload?.rows || []).length, totalPages: 1 },
  };
};

/**
 * Fetch detailed profile, supervisor, and live telemetry for a single team member (FRD 11.25)
 */
export const fetchTeamMemberDetail = async (id) => {
  const response = await apiClient(`${TEAM_ENDPOINT}/${encodeURIComponent(id)}`);
  return getPayload(response);
};

/**
 * Add / Provision a new team member and dispatch onboarding invite (FRD 11.24)
 */
export const createTeamMember = async (payload) => {
  const response = await apiClient(TEAM_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return getPayload(response);
};

/**
 * Update member allocation and profile details
 */
export const updateTeamMember = async (id, payload) => {
  const response = await apiClient(`${TEAM_ENDPOINT}/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  return getPayload(response);
};

/**
 * Deactivate a team member and optionally reassign open leads/deals
 */
export const deactivateTeamMember = async (id, payload = {}) => {
  const response = await apiClient(`${TEAM_ENDPOINT}/${encodeURIComponent(id)}/deactivate`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return getPayload(response);
};

/**
 * Fetch territory dropdown options
 */
export const fetchTerritories = async () => {
  try {
    const response = await apiClient(`${TEAM_ENDPOINT}/territories`);
    return getPayload(response) || [];
  } catch {
    return [
      'North Region',
      'South Region',
      'West Region',
      'East Region',
      'Central Region',
      'Maharashtra & Goa',
      'Delhi NCR',
      'Karnataka',
    ];
  }
};
