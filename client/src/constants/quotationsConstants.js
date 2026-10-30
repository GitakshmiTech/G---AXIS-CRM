//==================================================================================================================
//    QUOTATIONS CONSTANTS AND MOCK DATA
//    Centralized mock data and dropdown options for Quotations workspace module
//==================================================================================================================

export const QUOTATION_PRODUCT_OPTIONS = [
  { value: 'All', label: 'By Product' },
  { value: 'Enterprise Cloud Data Mesh', label: 'Enterprise Cloud Data Mesh' },
  { value: 'Cloud Suite v4.2', label: 'Cloud Suite v4.2' },
  { value: 'CRM Platform', label: 'CRM Platform' },
  { value: 'ERP System', label: 'ERP System' },
];

export const QUOTATION_STATUS_OPTIONS = [
  { value: 'All', label: 'By Status' },
  { value: 'Pending Approval', label: 'Pending Approval' },
  { value: 'Draft', label: 'Draft' },
  { value: 'Sent', label: 'Sent' },
  { value: 'Accepted', label: 'Accepted' },
  { value: 'Rejected', label: 'Rejected' },
  { value: 'Expired', label: 'Expired' },
];

export const DEAL_DROPDOWN_OPTIONS = [
  { value: 'HyperScale Systems', label: 'HyperScale Systems' },
  { value: 'ABC Company Pvt Ltd', label: 'ABC Company Pvt Ltd' },
  { value: 'Apex Innovations', label: 'Apex Innovations' },
  { value: 'Global FinTech Corp', label: 'Global FinTech Corp' },
];

export const MOCK_QUOTATION_AVATARS = [
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
];

const STATUS_SEQUENCE = [
  'Pending Approval',
  'Draft',
  'Sent',
  'Accepted',
  'Rejected',
  'Expired',
  'Pending Approval',
  'Pending Approval',
  'Pending Approval',
  'Pending Approval',
];

export const INITIAL_QUOTATIONS_DATA = Array.from({ length: 10 }, (_, index) => ({
  id: `quote-${index + 1}`,
  code: `#${String(index + 1).padStart(3, '0')}`,
  dealName: 'Johnson Doe',
  dealRole: 'VP of Sales',
  dealAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop&crop=face',
  productInterest: MOCK_QUOTATION_AVATARS,
  extraProductCount: 5,
  expectedValue: '₹483,500',
  status: STATUS_SEQUENCE[index % STATUS_SEQUENCE.length],
  createdDate: '14 May 2025',
  createdTime: '08:45 AM',
  companyName: 'HyperScale Systems',
  linkedCompany: 'HyperScale Systems',
  assignedBde: 'Johnson Doe',
  dealAmount: '483,500',
  expectedCloseDate: '14/05/2025',
  productInterestName: 'Enterprise Cloud Data Mesh',
}));
