//===========================================================================================
//    DEALS API SERVICE AND RESPONSE MAPPING
// ===========================================================================================
import { apiClient } from './api';
import { formatDateDDMMYYYY } from '../utils/dateUtils';
import { formatCurrency } from '../utils/formatters';

const DEALS_ENDPOINT = '/crm/deals';
const unwrap = (response) => response?.data ?? response;

/** Map a backend Deal into the presentation fields used by the directory. */
export const mapDealFromApi = (deal = {}) => ({
  ...deal,
  id: deal.deal_id || deal.id || '',
  code: String(deal.deal_no || deal.code || '').toUpperCase(),
  title: deal.deal_title || deal.title || '',
  dealName: deal.deal_title || deal.title || '',
  companyName: deal.account?.acc_company || deal.companyName || '',
  accountId: deal.deal_account_id || deal.account?.acc_id || '',
  productId: deal.deal_product_id || '',
  productLabel: deal.deal_product_id ? `Product ${String(deal.deal_product_id).slice(0, 8)}` : 'Not specified',
  value: Number(deal.deal_value) || 0,
  probability: deal.deal_probability === null || deal.deal_probability === undefined ? '' : Number(deal.deal_probability),
  userCount: deal.deal_user_count ?? '',
  lostReason: deal.deal_lost_reason || '',
  expectedValue: formatCurrency(deal.deal_value, '₹') || '—',
  stage: String(deal.deal_stage || '').replace(/\b\w/g, (letter) => letter.toUpperCase()),
  stageValue: deal.deal_stage || '',
  expectedCloseDate: formatDateDDMMYYYY(deal.deal_close_date) || '—',
  closeDate: deal.deal_close_date ? formatDateDDMMYYYY(deal.deal_close_date) : '',
  ownerId: deal.deal_owner_id || '',
  assignedBde: deal.ownerName || 'Unassigned',
  createdDate: formatDateDDMMYYYY(deal.deal_created_at),
  createdTime: deal.deal_created_at ? new Date(deal.deal_created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '',
});

/** Fetch a paginated Deal list with backend search, stage, and owner filters. */
export const fetchDeals = async ({ page = 1, limit = 10, search = '', stage = '', ownerId = '', signal } = {}) => {
  const query = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (search.trim()) query.set('search', search.trim());
  if (stage) query.set('stage', stage);
  if (ownerId) query.set('ownerId', ownerId);
  const result = unwrap(await apiClient(`${DEALS_ENDPOINT}?${query}`, { signal }));
  const rows = Array.isArray(result) ? result : result?.rows || [];
  return {
    rows: rows.map(mapDealFromApi),
    owners: result?.owners || [],
    stats: result?.stats || null,
    pagination: result?.pagination || { page, limit, total: rows.length, totalPages: 1 },
  };
};

/** Fetch a single Deal and its account and owner details. */
export const fetchDeal = async (id) => mapDealFromApi(
  unwrap(await apiClient(`${DEALS_ENDPOINT}/${encodeURIComponent(id)}`)),
);

/** Persist a list-view stage change using the backend's audited stage endpoint. */
export const updateDealStage = async (id, stage) => {
  const response = unwrap(await apiClient(`${DEALS_ENDPOINT}/${encodeURIComponent(id)}/stage`, {
    method: 'PATCH',
    body: JSON.stringify({ stage: stage?.trim().toLowerCase() }),
  }));
  return mapDealFromApi(response?.data?.deal || response?.data || response?.deal || response);
};

/** Download the API CSV using the active directory filters. */
export const exportDeals = async ({ search = '', stage = '', ownerId = '' } = {}) => {
  const query = new URLSearchParams();
  if (search.trim()) query.set('search', search.trim());
  if (stage) query.set('stage', stage);
  if (ownerId) query.set('ownerId', ownerId);
  const suffix = query.toString();
  return apiClient(`${DEALS_ENDPOINT}/export${suffix ? `?${suffix}` : ''}`, { responseType: 'blob' });
};

const resolveOwnerId = (val) => {
  if (!val || val === '__unassigned__') return null;
  return String(val).trim();
};

/** Persist supported Deal fields and stage changes through their dedicated endpoints. */
export const saveDeal = async (id, values) => {
  const dateParts = values.closeDate?.split('/');
  const closeDate = dateParts?.length === 3 ? `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}` : null;
  const payload = {
    title: values.dealName?.trim(),
    value: values.dealAmount ? Number(values.dealAmount.replaceAll(',', '')) : null,
    productId: values.productInterest || null,
    probability: values.probability === '' ? null : Number(values.probability),
    userCount: values.userCount === '' ? null : Number(values.userCount),
    stage: values.stage?.trim().toLowerCase().replace(/[_-]+/g, ' '),
    ownerId: resolveOwnerId(values.ownerId),
    closeDate,
    lostReason: values.lostReason?.trim() || '',
  };
  const updated = unwrap(await apiClient(`${DEALS_ENDPOINT}/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(payload) }));
  return mapDealFromApi(updated);
};

