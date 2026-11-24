//===========================================================================================
//    REPORTS & ANALYTICS API SERVICE (FRD CRM-028 & Section 10)
//    Connects frontend to backend /crm/reports endpoints with resilient fallbacks
// ===========================================================================================

import { apiClient } from './api';

const REPORTS_ENDPOINT = '/crm/reports';
const unwrap = (response) => response?.data ?? response;
const getPayload = (response) => {
  const value = unwrap(response);
  return value?.data ?? value;
};

/**
 * Fetch Top-Level Funnel Telemetry KPIs
 */
export const fetchFunnelKpis = async ({
  timeframe = 'all',
  startDate,
  endDate,
  bdeId,
  signal,
} = {}) => {
  const query = new URLSearchParams();
  if (timeframe && timeframe !== 'All') query.set('timeframe', timeframe);
  if (startDate) query.set('startDate', startDate);
  if (endDate) query.set('endDate', endDate);
  if (bdeId && bdeId !== 'All') query.set('bdeId', bdeId);

  const response = await apiClient(`${REPORTS_ENDPOINT}/funnel-kpis?${query}`, { signal });
  return getPayload(response);
};

/**
 * Fetch Team / BDE Performance Report
 */
export const fetchTeamPerformanceReport = async ({
  page = 1,
  limit = 10,
  search = '',
  status = 'All',
  bdeId,
  timeframe = 'all',
  startDate,
  endDate,
  signal,
} = {}) => {
  const query = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (search.trim()) query.set('search', search.trim());
  if (status && status !== 'All') query.set('status', status);
  if (bdeId && bdeId !== 'All') query.set('bdeId', bdeId);
  if (timeframe && timeframe !== 'All') query.set('timeframe', timeframe);
  if (startDate) query.set('startDate', startDate);
  if (endDate) query.set('endDate', endDate);

  const response = await apiClient(`${REPORTS_ENDPOINT}/team-performance?${query}`, { signal });
  const payload = getPayload(response);
  return {
    rows: payload?.rows || [],
    pagination: payload?.pagination || { page, limit, total: 0, totalPages: 1 },
  };
};

/**
 * Fetch Lead Source Attribution & Outcome Funnel Report
 */
export const fetchLeadSourceAttributionReport = async ({
  timeframe = 'all',
  startDate,
  endDate,
  source = 'All',
  signal,
} = {}) => {
  const query = new URLSearchParams();
  if (timeframe && timeframe !== 'All') query.set('timeframe', timeframe);
  if (startDate) query.set('startDate', startDate);
  if (endDate) query.set('endDate', endDate);
  if (source && source !== 'All') query.set('source', source);

  const response = await apiClient(`${REPORTS_ENDPOINT}/lead-source-attribution?${query}`, { signal });
  const payload = getPayload(response);
  return {
    rows: payload?.rows || [],
    totalSources: payload?.totalSources || 0,
  };
};

/**
 * Fetch Report Drill-down records
 */
export const fetchReportDrilldown = async (type, identifier, { timeframe, signal } = {}) => {
  try {
    const query = new URLSearchParams();
    if (timeframe && timeframe !== 'All') query.set('timeframe', timeframe);

    const response = await apiClient(`${REPORTS_ENDPOINT}/drilldown/${encodeURIComponent(type)}/${encodeURIComponent(identifier)}?${query}`, { signal });
    return getPayload(response);
  } catch (error) {
    console.warn('Failed to fetch report drilldown from backend:', error);
    return null;
  }
};

/**
 * Fetch Report Filter metadata (Lead sources, date options, executives)
 */
export const fetchReportFilterOptions = async ({ signal } = {}) => {
  try {
    const response = await apiClient(`${REPORTS_ENDPOINT}/filter-options`, { signal });
    return getPayload(response);
  } catch (error) {
    console.warn('Failed to fetch report filter options from backend:', error);
    return null;
  }
};

/**
 * Export Team Performance to CSV
 */
export const exportTeamPerformanceReport = async ({ timeframe, startDate, endDate, search, status } = {}) => {
  const query = new URLSearchParams();
  if (timeframe && timeframe !== 'All') query.set('timeframe', timeframe);
  if (startDate) query.set('startDate', startDate);
  if (endDate) query.set('endDate', endDate);
  if (search?.trim()) query.set('search', search.trim());
  if (status && status !== 'All') query.set('status', status);

  const downloadUrl = `${REPORTS_ENDPOINT}/team-performance/export?${query}`;
  window.open(downloadUrl, '_blank');
};

/**
 * Export Lead Source Attribution to CSV
 */
export const exportLeadSourceReport = async ({ timeframe, startDate, endDate, source } = {}) => {
  const query = new URLSearchParams();
  if (timeframe && timeframe !== 'All') query.set('timeframe', timeframe);
  if (startDate) query.set('startDate', startDate);
  if (endDate) query.set('endDate', endDate);
  if (source && source !== 'All') query.set('source', source);

  const downloadUrl = `${REPORTS_ENDPOINT}/lead-source-attribution/export?${query}`;
  window.open(downloadUrl, '_blank');
};
