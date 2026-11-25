//===========================================================================================
//    LEADS API SERVICE AND RESPONSE MAPPING
// ===========================================================================================
import { apiClient } from './api';

const LEADS_ENDPOINT = '/crm/leads';
const STAGE_LABELS = {
  new: 'New', contacted: 'Contacted', 'in discussion': 'Negotiation',
  qualified: 'Qualified', nurture: 'Nurture', disqualified: 'Disqualified', lost: 'Lost',
  unassigned: 'Unassigned', converted: 'Won',
};
const STAGE_VALUES = {
  New: 'new', Contacted: 'contacted', Qualified: 'qualified', Negotiation: 'in discussion',
  Nurture: 'nurture', Disqualified: 'disqualified', Unassigned: 'unassigned',
  Won: 'converted', Lost: 'lost',
};

const unwrap = (response) => response?.data ?? response;
const getRequirementFields = (value = '') => {
  const fields = {};
  String(value).split('|').forEach((part) => {
    const separator = part.indexOf(':');
    if (separator > 0) fields[part.slice(0, separator).trim().toLowerCase()] = part.slice(separator + 1).trim();
  });
  return fields;
};
const asDate = (value) => {
  if (!value) return { createdDate: '', createdTime: '' };
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return { createdDate: '', createdTime: '' };
  return {
    createdDate: date.toLocaleDateString('en-GB'),
    createdTime: date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
  };
};

/** Convert backend lead rows to the existing leads UI model while retaining unknown fields. */
export const mapLeadFromApi = (lead = {}) => {
  const requirementFields = getRequirementFields(lead.lds_requirement || lead.requirement || '');
  return ({
  ...lead,
  id: lead.lds_id || lead.id,
  code: String(lead.lds_lead_no || lead.code || '').toUpperCase(),
  name: lead.lds_contact || lead.fullName || lead.name || '',
  companyName: lead.lds_company || lead.company || lead.companyName || '',
  email: lead.lds_email || lead.email || '',
  phone: lead.lds_phone || lead.phone || '',
  leadSource: lead.lds_source || lead.source || lead.leadSource || '',
  website: lead.lds_website || lead.website || '',
  industry: lead.lds_industry_id || lead.industry || '',
  industryId: lead.lds_industry_id || lead.industryId || '',
  city: lead.lds_city_id || lead.city || '',
  cityId: lead.lds_city_id || lead.cityId || '',
  requirement: requirementFields.requirement || lead.lds_requirement || lead.requirement || '',
  productInterest: requirementFields['product interest'] || lead.productInterest || '',
  designation: requirementFields.designation || lead.designation || '',
  address: requirementFields.address || lead.address || '',
  country: requirementFields.country || lead.country || '',
  state: requirementFields.state || lead.state || '',
  postalCode: requirementFields['postal code'] || lead.postalCode || '',
  expectedValue: lead.lds_exp_value ?? lead.expectedValue ?? '',
  activities: Array.isArray(lead.activities) ? lead.activities.map((activity) => ({
    id: activity.flw_id || activity.id,
    type: String(activity.flw_type || activity.type || '').toLowerCase(),
    title: `${String(activity.flw_type || 'Activity').replace(/^./, (letter) => letter.toUpperCase())} activity`,
    text: activity.flw_notes || activity.notes || '',
    description: activity.flw_notes || activity.flw_outcome || '',
    timestamp: asDate(activity.flw_at).createdDate
      ? `${asDate(activity.flw_at).createdDate} ${asDate(activity.flw_at).createdTime}`
      : '',
  })) : [],
  stage: STAGE_LABELS[String(lead.lds_status || lead.status || '').toLowerCase()] || lead.stage || 'New',
  priority: requirementFields.priority || lead.priority || '',
  createdDate: asDate(lead.lds_created_at || lead.createdAt).createdDate,
  createdTime: asDate(lead.lds_created_at || lead.createdAt).createdTime,
  avatar: lead.avatar || '',
  companyLogo: lead.companyLogo || '',
  assignedTo: lead.lds_assigned_to || lead.assignedTo || '',
  assignedUser: lead.assignedUser || null,
  assignedUserName: lead.assignedUser?.usr_name || lead.assignedUserName || '',
  });
};

const resolveAssignedTo = (val) => {
  if (!val) return undefined;
  const str = String(val).trim();
  if (!str || str === '__unassigned__') return undefined;
  return str;
};

/** Convert form fields into the backend allowlisted lead payload and retain extension fields. */
export const mapLeadToApi = (form = {}) => {
  const cleanNumber = (val) => {
    if (val === undefined || val === null || val === '') return undefined;
    const num = Number(String(val).replace(/[^0-9.-]/g, ''));
    return Number.isFinite(num) ? num : undefined;
  };

  const cleanWebsite = (val) => {
    if (!val) return undefined;
    const str = String(val).trim();
    if (!str) return undefined;
    return /^https?:\/\//i.test(str) ? str : `https://${str}`;
  };

  return {
    company: form.companyName?.trim() || form.company?.trim(),
    fullName: form.name?.trim() || form.fullName?.trim(),
    email: form.email?.trim() || undefined,
    phone: form.phone?.trim() || undefined,
    source: form.leadSource || form.source || undefined,
    website: cleanWebsite(form.website),
    status: STAGE_VALUES[form.stage] || (form.status ? String(form.status).toLowerCase() : 'new'),
    industryId: form.industryId || (/^[\da-f-]{36}$/i.test(form.industry || '') ? form.industry : undefined),
    cityId: form.cityId || (/^[\da-f-]{36}$/i.test(form.city || '') ? form.city : undefined),
    expectedValue: cleanNumber(form.expectedValue),
    assignedTo: resolveAssignedTo(form.assignedTo),
    requirement: [
      ['Requirement', form.requirement], ['Priority', form.priority], ['Product Interest', form.productInterest],
      ['Designation', form.designation], ['Address', form.address], ['Country', form.country],
      ['State', form.state], ['Postal Code', form.postalCode],
    ].filter(([, value]) => value).map(([label, value]) => `${label}: ${value}`).join(' | ') || undefined,
    priority: form.priority || undefined,
    employeeScale: form.employeeScale || undefined,
  };
};

/** Fetch leads with backend-supported search and status filters. */
export const fetchLeads = async ({ search = '', status = '', source = '', page = 1, limit = 100 } = {}) => {
  const query = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (search.trim()) query.set('search', search.trim());
  if (status && STAGE_VALUES[status]) query.set('status', STAGE_VALUES[status]);
  if (source) query.set('source', source);
  const result = unwrap(await apiClient(`${LEADS_ENDPOINT}?${query}`));
  const rows = Array.isArray(result) ? result : result?.rows || [];
  return { rows: rows.map(mapLeadFromApi), pagination: result?.pagination || null };
};

/** Fetch one lead with its activity timeline. */
export const fetchLead = async (id) => mapLeadFromApi(unwrap(await apiClient(`${LEADS_ENDPOINT}/${encodeURIComponent(id)}`)));

/** Upload lead documents as multipart FormData; the browser supplies the boundary header. */
export const uploadLeadDocuments = async (id, files) => {
  const body = new FormData();
  files.forEach((file) => body.append('documents', file));
  return unwrap(await apiClient(`${LEADS_ENDPOINT}/${encodeURIComponent(id)}/documents`, { method: 'POST', body }));
};

/** Remove a previously uploaded file from a lead. */
export const deleteLeadDocument = async (id, documentId) => unwrap(await apiClient(
  `${LEADS_ENDPOINT}/${encodeURIComponent(id)}/documents/${encodeURIComponent(documentId)}`, { method: 'DELETE' },
));

/** Download a private lead document using the current authenticated API session. */
export const downloadLeadDocument = async (id, documentId, name) => {
  const blob = await apiClient(`${LEADS_ENDPOINT}/${encodeURIComponent(id)}/documents/${encodeURIComponent(documentId)}`, { responseType: 'blob' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url; link.download = name || 'lead-document'; link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};

/** Preview a private image or PDF in a new tab using the authenticated document endpoint. */
export const viewLeadDocument = async (id, documentId) => {
  const previewWindow = window.open('', '_blank');
  if (!previewWindow) throw new Error('Allow pop-ups to preview this document.');
  previewWindow.document.title = 'Loading document…';
  try {
    const blob = await apiClient(`${LEADS_ENDPOINT}/${encodeURIComponent(id)}/documents/${encodeURIComponent(documentId)}`, { responseType: 'blob' });
    const objectUrl = URL.createObjectURL(blob);
    previewWindow.location.href = objectUrl;
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 300000);
  } catch (error) {
    previewWindow.close();
    throw error;
  }
};

/** Create a lead through the authenticated CRM endpoint. */
export const createLead = async (form) => mapLeadFromApi(unwrap(await apiClient(LEADS_ENDPOINT, {
  method: 'POST', body: JSON.stringify(mapLeadToApi(form)),
})));

/** Persist editable fields using the backend PATCH endpoint. */
export const updateLead = async (id, form) => {
  const result = unwrap(await apiClient(`${LEADS_ENDPOINT}/${encodeURIComponent(id)}`, {
    method: 'PATCH', body: JSON.stringify(mapLeadToApi(form)),
  }));
  if (form.stage && STAGE_VALUES[form.stage]) {
    await updateLeadStatus(id, form.stage);
  }
  return mapLeadFromApi(result);
};

/** Update the lifecycle status of a lead. */
export const updateLeadStatus = async (id, stage) => mapLeadFromApi(unwrap(await apiClient(`${LEADS_ENDPOINT}/${encodeURIComponent(id)}/status`, {
  method: 'PATCH', body: JSON.stringify({ status: STAGE_VALUES[stage] || 'new' }),
})));

/** Convert a backend-qualified lead to its related account and contact. */
export const convertLead = async (id, deal) => unwrap(await apiClient(`${LEADS_ENDPOINT}/${encodeURIComponent(id)}/convert`, {
  method: 'POST', body: JSON.stringify(deal || {}),
}));

/** Save a lead comment as a note activity using the backend activity endpoint. */
export const addLeadComment = async (id, notes) => {
  const activity = unwrap(await apiClient(`${LEADS_ENDPOINT}/${encodeURIComponent(id)}/activities`, {
    method: 'POST',
    body: JSON.stringify({ type: 'note', notes }),
  }));
  const date = asDate(activity.flw_at || activity.createdAt);
  return {
    id: activity.flw_id || activity.id,
    type: 'note',
    text: activity.flw_notes || notes,
    timestamp: date.createdDate ? `${date.createdDate} ${date.createdTime}` : '',
    avatar: '',
  };
};

