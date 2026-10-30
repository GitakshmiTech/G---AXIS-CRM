//==================================================================================================================
//    LOST REASON AND ACTIVITY MODALITY CONFIGURATION DATA
//    Initial values and selectable options for the CRM configuration screens
// ==================================================================================================================

export const INITIAL_LOST_REASONS = [
  { id: 'lr-1', code: '#001', name: 'Budget', reportingBucket: 'Commercial / Financial Constraint', status: 'Active' },
  { id: 'lr-2', code: '#002', name: 'Competitor selected', reportingBucket: 'Competitive Displacement', status: 'Active' },
  { id: 'lr-3', code: '#003', name: 'No requirement', reportingBucket: 'No Decision / Status Quo Retained', status: 'Active' },
  { id: 'lr-4', code: '#004', name: 'Timeline changed', reportingBucket: 'Project Postponed Indefinitely', status: 'Active' },
  { id: 'lr-5', code: '#005', name: 'Product limitation', reportingBucket: 'Feature Gap / Security Compliance', status: 'Active' },
  { id: 'lr-6', code: '#006', name: 'Customer cancelled', reportingBucket: 'Internal Restructuring / Disengagement', status: 'Active' },
  { id: 'lr-7', code: '#007', name: 'Other', reportingBucket: 'Ad-hoc Operational Exception', status: 'Active' },
];

export const LOST_REASON_OPTIONS = INITIAL_LOST_REASONS.map(({ name }) => ({ label: name, value: name }));
export const REPORTING_BUCKET_OPTIONS = [...new Set(INITIAL_LOST_REASONS.map(({ reportingBucket }) => reportingBucket))].map((value) => ({ label: value, value }));

export const INITIAL_ACTIVITY_MODALITIES = [
  { id: 'am-1', code: '#001', name: 'Call', icon: 'Phone', syncBridge: 'Commercial / Financial Constraint', status: 'Active' },
  { id: 'am-2', code: '#002', name: 'Email', icon: 'Mail', syncBridge: 'Competitive Displacement', status: 'Active' },
  { id: 'am-3', code: '#003', name: 'Meeting/Google Meet', icon: 'Video', syncBridge: 'No Decision / Status Quo Retained', status: 'Active' },
  { id: 'am-4', code: '#004', name: 'Task', icon: 'CircleCheck', syncBridge: 'Project Postponed Indefinitely', status: 'Active' },
  { id: 'am-5', code: '#005', name: 'Follow-up', icon: 'Clock', syncBridge: 'Internal Restructuring / Disengagement', status: 'Active' },
  { id: 'am-6', code: '#006', name: 'Note', icon: 'NotebookText', syncBridge: 'Ad-hoc Operational Exception', status: 'Active' },
];

export const ACTIVITY_MODALITY_OPTIONS = INITIAL_ACTIVITY_MODALITIES.map(({ name }) => ({ label: name, value: name }));
export const SYNC_BRIDGE_OPTIONS = [...new Set(INITIAL_ACTIVITY_MODALITIES.map(({ syncBridge }) => syncBridge))].map((value) => ({ label: value, value }));
