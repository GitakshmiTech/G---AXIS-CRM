//==================================================================================================================
//    CONTACTS CONSTANTS AND MOCK DATA
//    Centralized mock data and dropdown options for My Contacts workspace module
//==================================================================================================================

export const INITIAL_CONTACTS_DATA = Array.from({ length: 10 }, (_, index) => ({
  id: `contact-${index + 1}`,
  code: `#${String(index + 1).padStart(3, '0')}`,
  name: 'Johnson Doe',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
  designation: 'VP of Sales',
  companyName: 'ABC Company Pvt Ltd',
  companyLogo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=80&h=80&fit=crop&crop=faces',
  website: 'www.abc.com',
  activeDeals: 2,
  phone: '98765 43210',
  email: 'johnson.doe@abccompany.com',
  createdDate: '14 May 2025',
  createdTime: '08:45 AM',
  leadSource: 'LinkedIn',
  assignedBde: 'Johnson Doe',
}));
