//==================================================================================================================
//    AUTHENTICATION & USER CONSTANTS
//    Default users, demo credentials, and role definitions for G-CRM unified auth
//==================================================================================================================

export const USER_ROLES = {
  ADMIN: 'admin',
  SALES: 'sales',
  BDE: 'bde',
};

export const DEFAULT_USERS = {
  admin: {
    id: 'usr-admin-01',
    name: 'Johnson Doe',
    email: 'admin@gcrm.com',
    role: 'admin',
    roleLabel: 'Super Admin',
    designation: 'Super Admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
  },
  sales: {
    id: 'usr-sales-01',
    name: 'Johnson Doe',
    email: 'sales@gcrm.com',
    role: 'sales',
    roleLabel: 'Sales Manager',
    designation: 'Sales Manager',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
  },
  bde: {
    id: 'usr-bde-01',
    name: 'Johnson Doe',
    email: 'bde@gcrm.com',
    role: 'bde',
    roleLabel: 'BDE',
    designation: 'Business Development Executive',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
  },
};

//==================================================================================================================
//    CREDENTIAL TO USER / ROLE RESOLVER
//    Automatically detects user role based on user credentials (email or username)
//==================================================================================================================
export const resolveUserByCredentials = (rawEmail = '') => {
  const email = (rawEmail || '').trim().toLowerCase();
  if (email.includes('admin')) {
    return {
      role: USER_ROLES.ADMIN,
      user: { ...DEFAULT_USERS.admin, email: rawEmail },
    };
  }
  if (email.includes('sales') || email.includes('manager')) {
    return {
      role: USER_ROLES.SALES,
      user: { ...DEFAULT_USERS.sales, email: rawEmail },
    };
  }
  return {
    role: USER_ROLES.BDE,
    user: { ...DEFAULT_USERS.bde, email: rawEmail },
  };
};
