//===========================================================================================
//    QUOTATIONS API SERVICE AND RESPONSE MAPPING
// ===========================================================================================
import { apiClient } from './api';
import { formatDateDDMMYYYY } from '../utils/dateUtils';
import { formatCurrency } from '../utils/formatters';

const QUOTATIONS_ENDPOINT = '/crm/quotations';
const unwrap = (response) => response?.data ?? response;

/** Convert backend statuses into concise labels used by the quotation directory. */
const formatStatus = (status = '') => String(status).replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

/** Adapt quotation records from the API to the shared directory table shape. */
export const mapQuotationFromApi = (quotation = {}) => {
  const lineItems = quotation.lineItems || quotation.quo_line_items || [];
  const total = quotation.financials?.totalAmount ?? quotation.quo_total_amount;
  const createdAt = quotation.quo_created_at || quotation.createdAt;
  return {
    ...quotation,
    id: quotation.quotationId || quotation.quo_id || quotation.id || '',
    code: String(quotation.quotationNo || quotation.quo_no || '').toUpperCase(),
    dealName: quotation.deal?.name || quotation.deal?.deal_title || '',
    dealCode: quotation.deal?.code || '',
    accountName: quotation.account?.name || quotation.account?.acc_company || '',
    productInterestName: [...new Set(lineItems.map((item) => item.productName).filter(Boolean))].join(', ') || '—',
    expectedValue: formatCurrency(total, '₹') || '—',
    value: Number(total) || 0,
    status: formatStatus(quotation.status || quotation.quo_status),
    statusValue: quotation.status || quotation.quo_status || '',
    createdDate: formatDateDDMMYYYY(createdAt) || '—',
    createdTime: createdAt ? new Date(createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '',
    canEdit: (quotation.status || quotation.quo_status) === 'draft',
  };
};

/** Load one server-filtered, server-paginated quotation page and its filter options. */
export const fetchQuotations = async ({ page = 1, limit = 10, search = '', status = '', product = '', signal } = {}) => {
  const query = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (search.trim()) query.set('search', search.trim());
  if (status) query.set('status', status);
  if (product) query.set('product', product);
  const response = unwrap(await apiClient(`${QUOTATIONS_ENDPOINT}?${query}`, { signal }));
  const result = response?.data || response;
  return {
    rows: (result?.rows || []).map(mapQuotationFromApi),
    pagination: result?.pagination || { page, limit, total: 0, totalPages: 1 },
    stats: result?.stats || {},
    productOptions: result?.productOptions || [],
  };
};

/** Create a quotation Draft linked to the selected Deal and Contact. */
export const createQuotation = async (payload) => mapQuotationFromApi(
  unwrap(await apiClient(QUOTATIONS_ENDPOINT, { method: 'POST', body: JSON.stringify(payload) })),
);

/** Fetch an authorized quotation with its commercial details, contact, and version history. */
export const fetchQuotation = async (id) => mapQuotationFromApi(
  unwrap(await apiClient(`${QUOTATIONS_ENDPOINT}/${encodeURIComponent(id)}`)),
);

/** Update a Draft quotation using supported commercial fields. */
export const updateQuotation = async (id, payload) => mapQuotationFromApi(
  unwrap(await apiClient(`${QUOTATIONS_ENDPOINT}/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(payload) })),
);

/** Submit a saved Draft quotation to the configured approval workflow. */
export const submitQuotationForApproval = async (id) => mapQuotationFromApi(
  unwrap(await apiClient(`${QUOTATIONS_ENDPOINT}/${encodeURIComponent(id)}/submit-approval`, { method: 'POST', body: JSON.stringify({}) })),
);

/** Approve a pending quotation with an optional manager note (FRD 11.35, 11.36). */
export const approveQuotation = async (id, payload = {}) => mapQuotationFromApi(
  unwrap(await apiClient(`${QUOTATIONS_ENDPOINT}/${encodeURIComponent(id)}/approve`, {
    method: 'POST',
    body: JSON.stringify({ note: payload.note || '' }),
  })),
);

/** Reject a pending quotation with a required rejection reason (FRD 11.35, 11.36). */
export const rejectQuotation = async (id, payload = {}) => mapQuotationFromApi(
  unwrap(await apiClient(`${QUOTATIONS_ENDPOINT}/${encodeURIComponent(id)}/reject`, {
    method: 'POST',
    body: JSON.stringify({ reason: payload.reason || 'Commercial terms rejected by manager.' }),
  })),
);

/** Send an approved quotation to customer. */
export const sendQuotation = async (id) => mapQuotationFromApi(
  unwrap(await apiClient(`${QUOTATIONS_ENDPOINT}/${encodeURIComponent(id)}/send`, {
    method: 'POST',
    body: JSON.stringify({}),
  })),
);

/** Fetch the audit timeline events for a quotation. */
export const fetchQuotationTimeline = async (id) => {
  const response = unwrap(await apiClient(`${QUOTATIONS_ENDPOINT}/${encodeURIComponent(id)}/timeline`));
  return response?.data || response || [];
};
