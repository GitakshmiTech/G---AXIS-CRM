//===========================================================================================
//    AUTHENTICATION & AUTHORIZATION MIDDLEWARE
//    Handles JWT verification, user context attachment, role checks, and subordinate discovery
//===========================================================================================

const jwt = require('jsonwebtoken');
const { Staff, Role } = require('../database/models');
const { errorResponse } = require('../common/helpers/response.helper');

const JWT_SECRET = process.env.JWT_SECRET || 'gcrm_super_secret_jwt_key_2026_enterprise';

/**
 * Helper to fetch reporting subordinates for a manager
 * @param {number} managerStaffId
 * @returns {Promise<number[]>}
 */
const getSubordinateIds = async (managerStaffId) => {
  try {
    const subordinates = await Staff.findAll({
      where: { reporting_manager_id: managerStaffId, status: 'active' },
      attributes: ['staff_id'],
    });
    return subordinates.map((s) => s.staff_id);
  } catch {
    return [];
  }
};

/**
 * Build standardized user object for req.user
 * @param {Object} staffInstance
 * @returns {Promise<Object>}
 */
const buildUserContext = async (staffInstance) => {
  const isManager = staffInstance.role?.role_code === 'SALES_MANAGER';
  const subordinateIds = isManager ? await getSubordinateIds(staffInstance.staff_id) : [];

  return {
    staffId: staffInstance.staff_id,
    employeeCode: staffInstance.employee_code,
    firstName: staffInstance.first_name,
    lastName: staffInstance.last_name,
    fullName: `${staffInstance.first_name} ${staffInstance.last_name}`,
    email: staffInstance.email,
    roleId: staffInstance.role_id,
    roleCode: staffInstance.role?.role_code || 'BDE',
    roleName: staffInstance.role?.role_name || 'Business Development Executive',
    roleLevel: staffInstance.role_level,
    departmentId: staffInstance.department_id,
    territoryId: staffInstance.territory_id,
    branchId: staffInstance.branch_id,
    reportingManagerId: staffInstance.reporting_manager_id,
    subordinateIds,
  };
};

/**
 * Primary Authentication Middleware
 * Validates Bearer JWT token from Authorization header and sets req.user
 */
const authenticate = async (req, res, next) => {
  try {
    let token = null;
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    // 1. Explicit Bearer JWT Token provided
    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET);

      let subordinateIds = decoded.subordinateIds || [];
      if (decoded.roleCode === 'SALES_MANAGER' && (!subordinateIds || !subordinateIds.length)) {
        subordinateIds = await getSubordinateIds(decoded.staffId);
      }

      req.user = {
        ...decoded,
        subordinateIds,
      };

      return next();
    }

    // 2. Development / Testing Fallback: x-staff-id header
    if (req.headers['x-staff-id']) {
      const devStaff = await Staff.findByPk(req.headers['x-staff-id'], {
        include: [{ model: Role, as: 'role' }],
      });
      if (devStaff) {
        req.user = await buildUserContext(devStaff);
        return next();
      }
    }

    // 3. Development Fallback when no token or header passed (default to BDE Sarah Jenkins)
    if (process.env.NODE_ENV !== 'production') {
      const defaultStaff = await Staff.findByPk(4, {
        include: [{ model: Role, as: 'role' }],
      });
      if (defaultStaff) {
        req.user = await buildUserContext(defaultStaff);
        return next();
      }
    }

    return errorResponse(res, 'Authentication required. Please provide a valid Bearer token.', 401);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Session token expired. Please login again.', 401);
    }
    return errorResponse(res, 'Invalid or corrupted authentication token.', 401);
  }
};

/**
 * Optional Authentication Middleware
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token = null;
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET);
      let subordinateIds = decoded.subordinateIds || [];
      if (decoded.roleCode === 'SALES_MANAGER' && (!subordinateIds || !subordinateIds.length)) {
        subordinateIds = await getSubordinateIds(decoded.staffId);
      }
      req.user = { ...decoded, subordinateIds };
    } else if (req.headers['x-staff-id']) {
      const devStaff = await Staff.findByPk(req.headers['x-staff-id'], {
        include: [{ model: Role, as: 'role' }],
      });
      if (devStaff) {
        req.user = await buildUserContext(devStaff);
      }
    }
    return next();
  } catch {
    return next();
  }
};

/**
 * Role-Based Access Control (RBAC) Guard
 * Restricts route execution to users with specific roles
 * @param  {...string} allowedRoles - E.g. 'SUPER_ADMIN', 'SALES_MANAGER', 'BDE'
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Authentication required.', 401);
    }

    if (!allowedRoles.includes(req.user.roleCode)) {
      return errorResponse(
        res,
        `Access denied. Requires one of roles: [${allowedRoles.join(', ')}]. Current role: ${req.user.roleCode}`,
        403
      );
    }

    return next();
  };
};

module.exports = {
  authenticate,
  optionalAuth,
  authorizeRoles,
};
