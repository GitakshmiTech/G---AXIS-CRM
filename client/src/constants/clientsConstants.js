//==================================================================================================================
//    CLIENTS CONSTANTS AND MOCK DATA
//    Centralized mock data and dropdown options for My Clients workspace module
//==================================================================================================================

export const CLIENT_INDUSTRY_OPTIONS = [
  { value: 'All', label: 'By Industry Type' },
  { value: 'Enterprise Solutions', label: 'Enterprise Solutions' },
  { value: 'Information Technology', label: 'Information Technology' },
  { value: 'Finance & Banking', label: 'Finance & Banking' },
  { value: 'Manufacturing', label: 'Manufacturing' },
  { value: 'Healthcare', label: 'Healthcare' },
];

export const CLIENT_STAGE_OPTIONS = [
  { value: 'All', label: 'By Stage' },
  { value: 'Proposal', label: 'Proposal' },
  { value: 'Negotiation', label: 'Negotiation' },
  { value: 'Won', label: 'Won' },
  { value: 'Active', label: 'Active' },
];

export const MOCK_STAKEHOLDER_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=60&h=60&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&crop=face',
];

export const INITIAL_CLIENTS_DATA = Array.from({ length: 10 }, (_, index) => ({
  id: `client-${index + 1}`,
  code: `#${String(index + 1).padStart(3, '0')}`,
  name: 'ABC Company Pvt Ltd',
  website: 'www.abc.com',
  companyLogo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=80&h=80&fit=crop&crop=faces',
  industryType: 'Enterprise Solutions',
  stakeholders: MOCK_STAKEHOLDER_AVATARS,
  extraStakeholdersCount: 5,
  assignedBde: 'Johnson Doe',
  assignedBdeAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&h=60&fit=crop&crop=face',
  stage: 'Proposal',
  createdDate: '14 May 2025',
  createdTime: '08:45 AM',
  employeeScale: '0 - 50',
  email: 'johnson.doe@abccompany.com',
  phone: '98765 43210',
  address: 'Kaivanna Complex, 304 - 306 & 701, Chimanlal Girdharlal Rd, Panchavati Society, Ambawadi, Ahmedabad',
  country: 'India',
  state: 'Gujarat',
  city: 'Ahmedabad',
  postalCode: '380009',
}));
