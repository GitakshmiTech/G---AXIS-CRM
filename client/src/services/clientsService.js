//===========================================================================================
//    CLIENT ACCOUNT API SERVICE
// ===========================================================================================
import { apiClient } from './api';
import { formatDateDDMMYYYY } from '../utils/dateUtils';

const ACCOUNTS_ENDPOINT = '/crm/accounts';
const unwrap = (response) => response?.data ?? response;
const clientDetailCache = new Map();
const clientDetailRequests = new Map();

/** Map backend Account fields and related-record summaries into the Clients workspace model. */
export const mapAccountFromApi = (account = {}) => ({
  ...account,
  id: account.acc_id || account.id || '',
  code: String(account.acc_no || account.code || '').toUpperCase(),
  name: account.acc_company || account.company || '',
  industryId: account.acc_industry_id || account.industryId || '',
  industryType: account.industryName || account.industryType || (account.acc_industry_id ? 'Industry unavailable' : 'Not specified'),
  email: account.acc_email || account.email || '',
  phone: account.acc_phone || account.phone || '',
  address: account.acc_address || account.address || '',
  gstNo: account.acc_gst_no || account.gstNo || '',
  ownerId: account.acc_owner_id || account.ownerId || '',
  assignedBde: account.ownerName || account.assignedBde || 'Unassigned',
  stakeholderCount: Number(account.contactCount ?? account.stakeholderCount) || 0,
  activeDealsCount: Number(account.activeDealsCount) || 0,
  activeDealValue: Number(account.activeDealValue) || 0,
  activeDealStages: account.activeDealStages || [],
  createdDate: formatDateDDMMYYYY(account.acc_created_at || account.createdDate) || '—',
  createdTime: account.acc_created_at ? new Date(account.acc_created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '',
});

/** Fetch an authorized page of Accounts with backend filtering and aggregate metadata. */
export const fetchClients = async ({ page = 1, limit = 10, search = '', industryId = '', contactRange = '' } = {}) => {
  const query = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (search.trim()) query.set('search', search.trim());
  if (industryId) query.set('industryId', industryId);
  if (contactRange) query.set('contactRange', contactRange);
  const result = unwrap(await apiClient(`${ACCOUNTS_ENDPOINT}?${query}`));
  const data = result?.data || result;
  return {
    rows: (data?.rows || []).map(mapAccountFromApi),
    pagination: data?.pagination || { page, limit, total: 0, totalPages: 1 },
    stats: data?.stats || { totalAccounts: 0, linkedContacts: 0, activeDealsValue: 0 },
    industries: data?.industries || [],
  };
};

/** Fetch the active Industry Master values for an Account edit page. */
export const fetchIndustries = async () => {
  const result = unwrap(await apiClient(`${ACCOUNTS_ENDPOINT}/industries`));
  const data = result?.data || result;
  return Array.isArray(data) ? data : [];
};

/** Load one authorized Account and its linked Contacts and Deals for the detail drawer. */
export const fetchClient = async (id) => {
  const key = String(id);
  const cached = clientDetailCache.get(key);
  if (cached && Date.now() - cached.createdAt < 5000) return cached.client;
  if (clientDetailRequests.has(key)) return clientDetailRequests.get(key);
  const request = apiClient(`${ACCOUNTS_ENDPOINT}/${encodeURIComponent(id)}`)
    .then(unwrap)
    .then((result) => {
      const client = mapAccountFromApi(result?.data || result);
      clientDetailCache.set(key, { client, createdAt: Date.now() });
      return client;
    })
    .finally(() => clientDetailRequests.delete(key));
  clientDetailRequests.set(key, request);
  return request;
};

/** Persist the account fields supported by the Accounts API. */
export const saveClient = async (id, values) => {
  const payload = {
    company: values.name,
    email: values.email || null,
    phone: values.phone || null,
    address: values.address || null,
    gstNo: values.gstNo || null,
  };
  if (values.industryId !== values.originalIndustryId) {
    payload.industryId = values.industryId || null;
  }
  const result = unwrap(await apiClient(`${ACCOUNTS_ENDPOINT}/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  }));
  clientDetailCache.delete(String(id));
  return mapAccountFromApi(result?.data || result);
};

/** Clear short-lived Account detail responses when the user explicitly refreshes the directory. */
export const clearClientDetailsCache = () => clientDetailCache.clear();

/** Export all authorized Accounts matching current search and industry filters. */
export const exportClients = async ({ search = '', industryId = '', contactRange = '' } = {}) => {
  const query = new URLSearchParams();
  if (search.trim()) query.set('search', search.trim());
  if (industryId) query.set('industryId', industryId);
  if (contactRange) query.set('contactRange', contactRange);
  const suffix = query.toString();
  return apiClient(`${ACCOUNTS_ENDPOINT}/export${suffix ? `?${suffix}` : ''}`, { responseType: 'blob' });
};
