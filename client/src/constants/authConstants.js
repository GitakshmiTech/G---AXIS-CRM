//==================================================================================================================
//    AUTHENTICATION & USER CONSTANTS
//    Default users, demo credentials, and role definitions for G-CRM unified auth
//==================================================================================================================

export const USER_ROLES = {
  ADMIN: 'admin',
  SALES: 'sales',
  BDE: 'bde',
};

//==================================================================================================================
//    DEMO CREDENTIALS (for local/mock testing without a live backend)
//    These match the seeded database users exactly.
//==================================================================================================================
export const DEMO_CREDENTIALS = [
  { role: 'admin',  email: 'admin@gitakshmi.com',   password: 'Admin@123',  label: 'CRM Admin',      name: 'Arthur Pendelton' },
  { role: 'sales',  email: 'marcus@gitakshmi.com',  password: 'Admin@123',  label: 'Sales Manager',  name: 'Marcus Vance'     },
  { role: 'bde',    email: 'sarah@gitakshmi.com',   password: 'Admin@123',  label: 'BDE',            name: 'Sarah Jenkins'    },
];

export const DEFAULT_USERS = {
  admin: {
    id: 'usr-admin-01',
    name: 'Arthur Pendelton',
    email: 'admin@gitakshmi.com',
    role: 'admin',
    roleLabel: 'CRM Admin',
    designation: 'CRM Admin',
    phone: '+919876543210',
    employeeCode: 'EMP-001',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
  },
  sales: {
    id: 'usr-sales-01',
    name: 'Marcus Vance',
    email: 'marcus@gitakshmi.com',
    role: 'sales',
    roleLabel: 'Sales Manager',
    designation: 'Sales Manager',
    phone: '+919876543211',
    employeeCode: 'EMP-002',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
  },
  bde: {
    id: 'usr-bde-01',
    name: 'Sarah Jenkins',
    email: 'sarah@gitakshmi.com',
    role: 'bde',
    roleLabel: 'BDE',
    designation: 'Business Development Executive',
    phone: '+919876543212',
    employeeCode: 'EMP-003',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
  },
};

//==================================================================================================================
//    CREDENTIAL TO USER / ROLE RESOLVER
//    Detects role from email: "admin@" → Admin, "marcus@" → Sales, everything else → BDE.
//    Must mirror the backend's core_user_roles seeder assignment.
//==================================================================================================================
export const resolveUserByCredentials = (rawEmail = '') => {
  const email = (rawEmail || '').trim().toLowerCase();
  // admin@gitakshmi.com → role 1 = CRM Admin
  if (email.startsWith('admin') || email.includes('admin')) {
    return { role: USER_ROLES.ADMIN, user: { ...DEFAULT_USERS.admin, email: rawEmail } };
  }
  // marcus@gitakshmi.com → role 2 = Sales Manager
  if (email.startsWith('marcus') || email.includes('sales') || email.includes('manager')) {
    return { role: USER_ROLES.SALES, user: { ...DEFAULT_USERS.sales, email: rawEmail } };
  }
  // sarah@gitakshmi.com + everything else → role 3 = BDE
  return { role: USER_ROLES.BDE, user: { ...DEFAULT_USERS.bde, email: rawEmail } };
};
