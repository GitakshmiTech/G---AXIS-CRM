//===========================================================================================
//    STAFF MANAGEMENT API SERVICE (SUPER ADMIN WORKSPACE)
//    Connects Staff Management to backend /crm/team endpoint with robust fallback
// ===========================================================================================
import { apiClient } from './api';
import { INITIAL_ADMIN_STAFF_DATA } from '../constants/staffConstants';

const STAFF_ENDPOINT = '/crm/team';

const unwrap = (response) => response?.data ?? response;
const getPayload = (response) => {
  const value = unwrap(response);
  return value?.data ?? value;
};

/**
 * Fetch dynamic staff directory records with filters and pagination
 */
export const fetchStaffMembers = async ({
  page = 1,
  limit = 10,
  search = '',
  status = 'All',
  role = 'All',
  branch = 'All',
  signal,
} = {}) => {
  try {
    const query = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search && search.trim()) query.set('search', search.trim());
    if (status && status !== 'All') query.set('status', status.toLowerCase());
    if (role && role !== 'All') query.set('role', role);

    const response = await apiClient(`${STAFF_ENDPOINT}?${query}`, { signal });
    const payload = getPayload(response);

    const rawRows = payload?.rows || [];
    const formattedRows = rawRows.map((u) => ({
      id: u.id,
      code: u.code || u.employeeCode || `EMP-${String(u.id).slice(0, 4)}`,
      name: u.name,
      email: u.email,
      phone: u.phone || '',
      role: u.role || 'Sales Executive',
      designation: u.designation || u.role || 'Sales Executive',
      reportingManager: u.reportingManager || (u.role?.includes('Admin') ? 'Board of Directors' : 'Marcus Vance'),
      managerRole: u.managerRole || (u.role?.includes('Admin') ? 'Executive' : 'Sales Manager'),
      branch: u.branch || 'Headquarters',
      status: u.status || 'Active',
      avatar: u.avatar || '',
      assignedLeads: u.assignedLeads ?? 0,
      activeDeals: u.activeDeals ?? 0,
      createdAt: u.createdAt,
    }));

    // In-memory filter for branch if specified
    const filteredRows = branch && branch !== 'All'
      ? formattedRows.filter((r) => (r.branch || '').toLowerCase() === branch.toLowerCase())
      : formattedRows;

    return {
      kpis: payload?.kpis || {
        totalMembers: filteredRows.length,
        activeMembers: filteredRows.filter((r) => r.status === 'Active').length,
        inactiveMembers: filteredRows.filter((r) => r.status !== 'Active').length,
      },
      rows: filteredRows,
      pagination: payload?.pagination || {
        page,
        limit,
        total: filteredRows.length,
        totalPages: Math.ceil(filteredRows.length / limit) || 1,
      },
    };
  } catch (err) {
    if (err?.name === 'AbortError') throw err;
    console.warn('Backend staff API unavailable, using offline fallback data:', err.message);

    const filtered = INITIAL_ADMIN_STAFF_DATA.filter((item) => {
      const matchSearch =
        !search.trim() ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.code.toLowerCase().includes(search.toLowerCase()) ||
        item.email.toLowerCase().includes(search.toLowerCase()) ||
        item.reportingManager.toLowerCase().includes(search.toLowerCase());
      const matchRole = role === 'All' || item.role.toLowerCase() === role.toLowerCase();
      const matchBranch = branch === 'All' || item.branch.toLowerCase() === branch.toLowerCase();
      const matchStatus = status === 'All' || item.status.toLowerCase() === status.toLowerCase();
      return matchSearch && matchRole && matchBranch && matchStatus;
    });

    const offset = (page - 1) * limit;
    return {
      kpis: {
        totalMembers: INITIAL_ADMIN_STAFF_DATA.length,
        activeMembers: INITIAL_ADMIN_STAFF_DATA.filter((i) => i.status === 'Active').length,
        inactiveMembers: INITIAL_ADMIN_STAFF_DATA.filter((i) => i.status !== 'Active').length,
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
 * Provision new staff member (FRD 10.3)
 */
export const createStaffMember = async (payload) => {
  const response = await apiClient(STAFF_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return getPayload(response);
};
