//==================================================================================================================
//    DEALS CONSTANTS AND MOCK DATA
//    Centralized mock data and dropdown options for My Deals workspace module
//==================================================================================================================

export const DEAL_PRODUCT_OPTIONS = [
  { value: 'All', label: 'By Product' },
  { value: 'Enterprise Cloud Data Mesh', label: 'Enterprise Cloud Data Mesh' },
  { value: 'Cloud Suite v4.2', label: 'Cloud Suite v4.2' },
  { value: 'CRM Platform', label: 'CRM Platform' },
  { value: 'ERP System', label: 'ERP System' },
];

export const DEAL_STAGE_OPTIONS = [
  { value: 'All', label: 'By Stage' },
  { value: 'Proposal', label: 'Proposal' },
  { value: 'Discovery', label: 'Discovery' },
  { value: 'Negotiation', label: 'Negotiation' },
  { value: 'Won', label: 'Won' },
  { value: 'Lost', label: 'Lost' },
];

export const MOCK_DEAL_AVATARS = [
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
];

export const INITIAL_DEALS_DATA = Array.from({ length: 10 }, (_, index) => ({
  id: `deal-${index + 1}`,
  code: `#${String(index + 1).padStart(3, '0')}`,
  dealName: 'Johnson Doe',
  dealRole: 'VP of Sales',
  dealAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop&crop=face',
  productInterest: MOCK_DEAL_AVATARS,
  extraProductCount: 5,
  expectedValue: '₹483,500',
  stage: 'Proposal',
  expectedCloseDate: '14 May 2025',
  dueDaysText: 'Due in 10 days',
  assignedBde: 'Johnson Doe',
  assignedBdeAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop&crop=face',
  createdDate: '14 May 2025',
  createdTime: '08:45 AM',
  companyName: 'HyperScale Systems',
  dealAmount: '483,500',
  startDate: '01/05/2025',
  closeDate: '14/05/2025',
  productInterestName: 'Enterprise Cloud Data Mesh',
}));
