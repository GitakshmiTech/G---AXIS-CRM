//==================================================================================================================
//    CRM CONFIGURATION CONSTANTS & MOCK DATA
//    Taxonomies, configuration categories, initial lead sources, and dropdown values (matching Image 3 & 4)
//==================================================================================================================

export const CONFIGURATION_CATEGORIES = [
  { id: 'lead-sources', label: 'Lead Sources', icon: 'Filter' },
  { id: 'lead-statuses', label: 'Lead Statuses', icon: 'Info' },
  { id: 'deal-stages', label: 'Deal Stages', icon: 'CircleDollarSign' },
  { id: 'industry-tier', label: 'Industry & Tier', icon: 'Factory' },
  { id: 'lost-reasons', label: 'Lost Reasons', icon: 'XCircle' },
  { id: 'activity-modalities', label: 'Activity Modalities', icon: 'Clock' },
  { id: 'sales-territories', label: 'Sales & Territories', icon: 'CirclePercent' },
  { id: 'commercial-pricing', label: 'Commercial & Pricing', icon: 'HandCoins' },
];

export const INITIAL_LEAD_SOURCES = [
  { id: 'src-1', code: '#001', name: 'Website', icon: 'Globe', entryMethod: 'API', status: 'Active' },
  { id: 'src-2', code: '#001', name: 'Linkedin', icon: 'Share2', entryMethod: 'Manual', status: 'Active' },
  { id: 'src-3', code: '#001', name: 'Referral', icon: 'ThumbsUp', entryMethod: 'Manual', status: 'Active' },
  { id: 'src-4', code: '#001', name: 'Exhibition/Event', icon: 'Calendar', entryMethod: 'Bulk Import', status: 'Active' },
  { id: 'src-5', code: '#001', name: 'Email', icon: 'Mail', entryMethod: 'API', status: 'Active' },
  { id: 'src-6', code: '#001', name: 'Phone', icon: 'Phone', entryMethod: 'Manual', status: 'Active' },
  { id: 'src-7', code: '#001', name: 'Partner', icon: 'Handshake', entryMethod: 'API', status: 'Active' },
  { id: 'src-8', code: '#001', name: 'Manual', icon: 'PenLine', entryMethod: 'Manual', status: 'Active' },
  { id: 'src-9', code: '#001', name: 'Campaign', icon: 'Megaphone', entryMethod: 'Bulk Import', status: 'Active' },
];

export const LEAD_SOURCE_NAME_OPTIONS = [
  { label: 'Select Source', value: '' },
  { label: 'Website', value: 'Website' },
  { label: 'Linkedin', value: 'Linkedin' },
  { label: 'Referral', value: 'Referral' },
  { label: 'Exhibition/Event', value: 'Exhibition/Event' },
  { label: 'Email', value: 'Email' },
  { label: 'Phone', value: 'Phone' },
  { label: 'Partner', value: 'Partner' },
  { label: 'Manual', value: 'Manual' },
  { label: 'Campaign', value: 'Campaign' },
];

export const ENTRY_METHOD_OPTIONS = [
  { label: 'Select Method', value: '' },
  { label: 'API', value: 'API' },
  { label: 'Manual', value: 'Manual' },
  { label: 'Bulk Import', value: 'Bulk Import' },
];

export const INITIAL_LEAD_STATUSES = [
  { id: 'st-1', code: '#001', name: 'New', icon: 'Star', funnelPosition: 'Unassigned Incoming', status: 'Active' },
  { id: 'st-2', code: '#001', name: 'Assigned', icon: 'Star', funnelPosition: 'Owner Allocated', status: 'Active' },
  { id: 'st-3', code: '#001', name: 'Contacted', icon: 'Star', funnelPosition: 'Outreach Attempted', status: 'Active' },
  { id: 'st-4', code: '#001', name: 'In Discussion', icon: 'Star', funnelPosition: '2-Way Communication', status: 'Active' },
  { id: 'st-5', code: '#001', name: 'Qualified', icon: 'Star', funnelPosition: 'Convertible to Deal', status: 'Active' },
  { id: 'st-6', code: '#001', name: 'Nurture', icon: 'Star', funnelPosition: 'Future Timeline Cadence', status: 'Active' },
  { id: 'st-7', code: '#001', name: 'Disqualified', icon: 'Star', funnelPosition: 'Dead / Unfit Persona', status: 'Active' },
];

export const LEAD_STATUS_NAME_OPTIONS = [
  { label: 'Select Source', value: '' },
  { label: 'New', value: 'New' },
  { label: 'Assigned', value: 'Assigned' },
  { label: 'Contacted', value: 'Contacted' },
  { label: 'In Discussion', value: 'In Discussion' },
  { label: 'Qualified', value: 'Qualified' },
  { label: 'Nurture', value: 'Nurture' },
  { label: 'Disqualified', value: 'Disqualified' },
];

export const FUNNEL_POSITION_OPTIONS = [
  { label: 'Select Method', value: '' },
  { label: 'Unassigned Incoming', value: 'Unassigned Incoming' },
  { label: 'Owner Allocated', value: 'Owner Allocated' },
  { label: 'Outreach Attempted', value: 'Outreach Attempted' },
  { label: '2-Way Communication', value: '2-Way Communication' },
  { label: 'Convertible to Deal', value: 'Convertible to Deal' },
  { label: 'Future Timeline Cadence', value: 'Future Timeline Cadence' },
  { label: 'Dead / Unfit Persona', value: 'Dead / Unfit Persona' },
];

export const INITIAL_DEAL_STAGES = [
  { id: 'ds-1', code: '#001', name: 'Qualification', icon: 'CircleDollarSign', milestone: 'Lead qualification', status: 'Active' },
  { id: 'ds-2', code: '#001', name: 'Discovery', icon: 'CircleDollarSign', milestone: 'Discovery call completed', status: 'Active' },
  { id: 'ds-3', code: '#001', name: 'Demo', icon: 'CircleDollarSign', milestone: 'Customer needs confirmed', status: 'Active' },
  { id: 'ds-4', code: '#001', name: 'Proposal/Quotation', icon: 'CircleDollarSign', milestone: 'Budget approval secured', status: 'Active' },
  { id: 'ds-5', code: '#001', name: 'Negotiation', icon: 'CircleDollarSign', milestone: 'Decision-makers aligned', status: 'Active' },
  { id: 'ds-6', code: '#001', name: 'Approval', icon: 'CircleDollarSign', milestone: 'Product demo completed', status: 'Active' },
  { id: 'ds-7', code: '#001', name: 'PO/Contract', icon: 'CircleDollarSign', milestone: 'Proposal submitted', status: 'Active' },
  { id: 'ds-8', code: '#001', name: 'Closed Won', icon: 'CheckCircle2', milestone: 'Contract terms agreed', status: 'Active', isWon: true },
  { id: 'ds-9', code: '#001', name: 'Closed Lost', icon: 'XCircle', milestone: 'Deal closed', status: 'Active', isLost: true },
];

export const DEAL_STAGE_NAME_OPTIONS = [
  { label: 'Select Stage', value: '' },
  { label: 'Qualification', value: 'Qualification' },
  { label: 'Discovery', value: 'Discovery' },
  { label: 'Demo', value: 'Demo' },
  { label: 'Proposal/Quotation', value: 'Proposal/Quotation' },
  { label: 'Negotiation', value: 'Negotiation' },
  { label: 'Approval', value: 'Approval' },
  { label: 'PO/Contract', value: 'PO/Contract' },
  { label: 'Closed Won', value: 'Closed Won' },
  { label: 'Closed Lost', value: 'Closed Lost' },
];

export const INITIAL_INDUSTRIES = [
  { id: 'ind-1', code: '#001', name: 'Technology & SaaS', status: 'Active' },
  { id: 'ind-2', code: '#001', name: 'Manufacturing & Industrial', status: 'Active' },
  { id: 'ind-3', code: '#001', name: 'Financial Services & Banking', status: 'Active' },
  { id: 'ind-4', code: '#001', name: 'Healthcare & Life Sciences', status: 'Active' },
  { id: 'ind-5', code: '#001', name: 'Retail & E-Commerce', status: 'Active' },
  { id: 'ind-6', code: '#001', name: 'Logistics & Supply Chain', status: 'Active' },
  { id: 'ind-7', code: '#001', name: 'Telecommunications', status: 'Active' },
];

export const INITIAL_CUSTOMER_TYPES = [
  { id: 'ct-1', code: '#001', name: 'Enterprise Tier 1', status: 'Active' },
  { id: 'ct-2', code: '#001', name: 'Mid-Market Commercial', status: 'Active' },
  { id: 'ct-3', code: '#001', name: 'Strategic OEM / Channel', status: 'Active' },
  { id: 'ct-4', code: '#001', name: 'SMB / Emerging', status: 'Active' },
  { id: 'ct-5', code: '#001', name: 'Government & Public Sector', status: 'Active' },
];


