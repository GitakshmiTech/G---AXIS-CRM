//===========================================================================================
//    AUTH MODULE CONTROLLER
//    Handles HTTP requests for login, session profile verification, and staff directory
//===========================================================================================

const authService = require('./auth.service');
const { successResponse, errorResponse } = require('../../common/helpers/response.helper');

/**
 * Handle staff login
 * POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    return successResponse(res, 'Authentication successful', result, 200);
  } catch (error) {
    const statusCode = error.message.includes('Invalid email or password') ? 401 : 400;
    return errorResponse(res, error.message, statusCode, error);
  }
};

/**
 * Handle fetch current authenticated user profile
 * GET /api/auth/me
 */
const getMe = async (req, res) => {
  try {
    const profile = await authService.getMe(req.user.staffId);
    return successResponse(res, 'Profile retrieved successfully', profile, 200);
  } catch (error) {
    return errorResponse(res, error.message, 404, error);
  }
};

/**
 * Handle fetch active staff directory for assignments
 * GET /api/auth/staff
 */
const getStaffDirectory = async (req, res) => {
  try {
    const staff = await authService.getStaffDirectory();
    return successResponse(res, 'Staff directory retrieved successfully', staff, 200);
  } catch (error) {
    return errorResponse(res, error.message, 500, error);
  }
};

module.exports = {
  login,
  getMe,
  getStaffDirectory,
};

