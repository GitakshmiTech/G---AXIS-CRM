//===========================================================================================
//    SALES TEAM API SERVICE
//    Connects to backend /crm/team API with robust local fallback for resilience
// ===========================================================================================
import { apiClient } from './api';
import { INITIAL_SALES_TEAM_DATA } from '../constants/salesTeamConstants';

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
  try {
    const query = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search.trim()) query.set('search', search.trim());
    if (status && status !== 'All') query.set('status', status.toLowerCase());
    if (role && role !== 'All') query.set('role', role);

    const response = await apiClient(`${TEAM_ENDPOINT}?${query}`, { signal });
    const payload = getPayload(response);

    return {
      kpis: payload?.kpis || {
        totalMembers: payload?.pagination?.total || 0,
        activeMembers: (payload?.rows || []).filter((r) => r.status === 'Active').length,
        inactiveMembers: (payload?.rows || []).filter((r) => r.status === 'Inactive').length,
      },
      rows: payload?.rows || [],
      pagination: payload?.pagination || { page, limit, total: (payload?.rows || []).length, totalPages: 1 },
    };
  } catch (err) {
    // Graceful offline fallback
    if (err?.name === 'AbortError') throw err;
    console.warn('Backend team API unavailable, using offline fallback data:', err.message);

    const filtered = INITIAL_SALES_TEAM_DATA.filter((item) => {
      const matchSearch = !search.trim() ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.code.toLowerCase().includes(search.toLowerCase()) ||
        item.email.toLowerCase().includes(search.toLowerCase());
      const matchStatus = status === 'All' || item.status.toLowerCase() === status.toLowerCase();
      const matchRole = role === 'All' || item.role.toLowerCase() === role.toLowerCase();
      return matchSearch && matchStatus && matchRole;
    });

    const offset = (page - 1) * limit;
    return {
      kpis: {
        totalMembers: INITIAL_SALES_TEAM_DATA.length,
        activeMembers: INITIAL_SALES_TEAM_DATA.filter((i) => i.status === 'Active').length,
        inactiveMembers: INITIAL_SALES_TEAM_DATA.filter((i) => i.status !== 'Active').length,
      },
      rows: filtered.slice(offset, offset + limit),
      pagination: {
        page,
        limit,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / limit) || 1,
      },
    };
  }
};

/**
 * Fetch detailed profile, supervisor, and live telemetry for a single team member (FRD 11.25)
 */
export const fetchTeamMemberDetail = async (id) => {
  try {
    const response = await apiClient(`${TEAM_ENDPOINT}/${encodeURIComponent(id)}`);
    return getPayload(response);
  } catch (err) {
    console.warn('Backend team detail API unavailable, using offline fallback:', err.message);
    const item = INITIAL_SALES_TEAM_DATA.find((m) => m.id === id) || INITIAL_SALES_TEAM_DATA[0];
    return {
      ...item,
      supervisor: { id: '2', name: 'Marcus Vance', designation: 'Sales Manager' },
      workSummary: {
        assignedLeads: item.leads || 15,
        activeDeals: item.deals || 4,
        managedAccounts: Math.round((item.leads || 15) / 2),
        linkedContacts: Math.round((item.leads || 15) * 1.5),
        pendingFollowups: 3,
        conversionRate: 26.5,
        activePipelineValue: 245000,
        wonRevenue: 120000,
      },
    };
  }
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
