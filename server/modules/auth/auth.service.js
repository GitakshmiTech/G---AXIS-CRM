//===========================================================================================
//    AUTH MODULE SERVICE
//    Handles user authentication, password verification, JWT generation, and profile lookup
//===========================================================================================

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Staff, Role } = require('../../database/models');

const JWT_SECRET = process.env.JWT_SECRET || 'gcrm_super_secret_jwt_key_2026_enterprise';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Authenticates user credentials and generates a signed JWT session
 * @param {Object} credentials - { email, password }
 * @returns {Promise<{token: string, user: Object}>}
 */
const login = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error('Email and password are required.');
  }

  const staff = await Staff.findOne({
    where: { email: email.toLowerCase().trim() },
    include: [{ model: Role, as: 'role' }],
  });

  if (!staff) {
    throw new Error('Invalid email or password.');
  }

  if (staff.status !== 'active') {
    throw new Error(`Account is currently ${staff.status}. Please contact your administrator.`);
  }

  const isPasswordValid = await bcrypt.compare(password, staff.password_hash);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password.');
  }

  // Update last login timestamp
  await staff.update({ last_login_at: new Date() });

  // Determine subordinates if user is a manager
  let subordinateIds = [];
  if (staff.role?.role_code === 'SALES_MANAGER') {
    const subs = await Staff.findAll({
      where: { reporting_manager_id: staff.staff_id, status: 'active' },
      attributes: ['staff_id'],
    });
    subordinateIds = subs.map((s) => s.staff_id);
  }

  // Build JWT payload
  const payload = {
    staffId: staff.staff_id,
    employeeCode: staff.employee_code,
    firstName: staff.first_name,
    lastName: staff.last_name,
    fullName: `${staff.first_name} ${staff.last_name}`,
    email: staff.email,
    roleId: staff.role_id,
    roleCode: staff.role?.role_code || 'BDE',
    roleName: staff.role?.role_name || 'Business Development Executive',
    roleLevel: staff.role_level,
    departmentId: staff.department_id,
    territoryId: staff.territory_id,
    branchId: staff.branch_id,
    reportingManagerId: staff.reporting_manager_id,
    subordinateIds,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

  return {
    token,
    user: {
      ...payload,
      phone: staff.phone,
      designation: staff.designation,
      jobTitle: staff.job_title,
      officeLocation: staff.office_location,
      operationTimezone: staff.operation_timezone,
      profilePhotoUrl: staff.profile_photo_url,
    },
  };
};

/**
 * Retrieves full user profile by staffId
 * @param {number} staffId
 * @returns {Promise<Object>}
 */
const getMe = async (staffId) => {
  const staff = await Staff.findByPk(staffId, {
    include: [{ model: Role, as: 'role' }],
    attributes: { exclude: ['password_hash'] },
  });

  if (!staff) {
    throw new Error('User not found.');
  }

  return {
    staffId: staff.staff_id,
    employeeCode: staff.employee_code,
    firstName: staff.first_name,
    lastName: staff.last_name,
    fullName: `${staff.first_name} ${staff.last_name}`,
    email: staff.email,
    phone: staff.phone,
    designation: staff.designation,
    jobTitle: staff.job_title,
    roleId: staff.role_id,
    roleCode: staff.role?.role_code || 'BDE',
    roleName: staff.role?.role_name || 'Business Development Executive',
    departmentId: staff.department_id,
    territoryId: staff.territory_id,
    branchId: staff.branch_id,
    profilePhotoUrl: staff.profile_photo_url,
    status: staff.status,
  };
};

/**
 * Retrieves directory of active staff for assignment dropdowns
 * @returns {Promise<Array>}
 */
const getStaffDirectory = async () => {
  const staffList = await Staff.findAll({
    where: { status: 'active' },
    include: [{ model: Role, as: 'role', attributes: ['role_id', 'role_code', 'role_name'] }],
    attributes: ['staff_id', 'employee_code', 'first_name', 'last_name', 'email', 'designation', 'profile_photo_url'],
    order: [['first_name', 'ASC']],
  });

  return staffList.map((s) => ({
    staffId: s.staff_id,
    employeeCode: s.employee_code,
    name: `${s.first_name} ${s.last_name}`,
    email: s.email,
    designation: s.designation,
    roleCode: s.role?.role_code || '',
    roleName: s.role?.role_name || '',
    avatar: s.profile_photo_url,
  }));
};

module.exports = {
  login,
  getMe,
  getStaffDirectory,
};

