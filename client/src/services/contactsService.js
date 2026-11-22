//===========================================================================================
//    CONTACTS API SERVICE AND RESPONSE MAPPING
// ===========================================================================================
import { apiClient } from './api';

const CONTACTS_ENDPOINT = '/crm/contacts';
const unwrap = (response) => response?.data ?? response;

/** Format backend timestamps using the CRM's DD/MM/YYYY display convention. */
const formatCreatedAt = (value) => {
  if (!value) return { createdDate: '', createdTime: '' };
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return { createdDate: '', createdTime: '' };
  return {
    createdDate: date.toLocaleDateString('en-GB'),
    createdTime: date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
  };
};

/** Adapt a backend Contact and its Account association to the existing directory shape. */
export const mapContactFromApi = (contact = {}) => {
  const id = contact.cnt_id || contact.id || '';
  const created = formatCreatedAt(contact.cnt_created_at || contact.createdAt);
  return {
    ...contact,
    id,
    code: contact.code || (id ? `CNT-${String(id).slice(0, 8)}`.toUpperCase() : ''),
    name: contact.cnt_name || contact.name || '',
    designation: contact.cnt_designation || contact.designation || '',
    email: contact.cnt_email || contact.email || '',
    phone: contact.cnt_phone || contact.phone || '',
    companyName: contact.account?.acc_company || contact.companyName || '',
    accountId: contact.cnt_account_id || contact.account?.acc_id || '',
    isPrimary: Boolean(Number(contact.cnt_is_primary ?? contact.isPrimary ?? 0)),
    activeDeals: Number(contact.activeDealCount ?? contact.activeDeals ?? 0),
    activeDealValue: Number(contact.activeDealValue ?? 0),
    createdDate: created.createdDate,
    createdTime: created.createdTime,
  };
};

/** Fetch a user-scoped, server-paginated Contact collection. */
export const fetchContacts = async ({ page = 1, limit = 10, search = '' } = {}) => {
  const query = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (search.trim()) query.set('search', search.trim());
  const result = unwrap(await apiClient(`${CONTACTS_ENDPOINT}?${query}`));
  const rows = Array.isArray(result) ? result : result?.rows || [];
  return {
    rows: rows.map(mapContactFromApi),
    pagination: result?.pagination || { page, limit, total: rows.length, totalPages: 1 },
  };
};

/** Fetch a Contact and its related Account for the full-page view or edit route. */
export const fetchContact = async (id) => mapContactFromApi(
  unwrap(await apiClient(`${CONTACTS_ENDPOINT}/${encodeURIComponent(id)}`))
);

/** Update the supported Contact fields without sending UI-only data to the API. */
export const updateContact = async (id, values) => mapContactFromApi(
  unwrap(await apiClient(`${CONTACTS_ENDPOINT}/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify({
      name: values.name?.trim(),
      designation: values.designation?.trim() || null,
      email: values.email?.trim() || null,
      phone: values.phone?.trim() || null,
      isPrimary: Boolean(values.isPrimary),
    }),
  }))
);

/** Request the backend CSV export with the same search term as the directory. */
export const exportContacts = async (search = '') => {
  const query = new URLSearchParams();
  if (search.trim()) query.set('search', search.trim());
  const queryString = query.toString();
  return apiClient(`${CONTACTS_ENDPOINT}/export${queryString ? `?${queryString}` : ''}`, { responseType: 'blob' });
};
