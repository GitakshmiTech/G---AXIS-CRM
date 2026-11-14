//===========================================================================================
//    ACCOUNTS MODULE CONTROLLER
//    Handles HTTP requests for accounts with role-scoped querying
//===========================================================================================

const accountsService = require('./accounts.service');
const { successResponse, errorResponse } = require('../../common/helpers/response.helper');

/** GET /api/accounts */
const getAccounts = async (req, res) => {
  try {
    const result = await accountsService.getAccounts(req.query, req.user);
    return successResponse(res, 'Accounts fetched successfully', result, 200);
  } catch (error) {
    return errorResponse(res, 'Failed to fetch accounts', 500, error);
  }
};

/** GET /api/accounts/:id */
const getAccountById = async (req, res) => {
  try {
    const account = await accountsService.getAccountById(req.params.id, req.user);
    if (!account) return errorResponse(res, `Account ${req.params.id} not found or access restricted`, 404);
    return successResponse(res, 'Account retrieved successfully', account, 200);
  } catch (error) {
    return errorResponse(res, 'Failed to fetch account', 500, error);
  }
};

/** POST /api/accounts */
const createAccount = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return errorResponse(res, 'Account name is required', 400);
    const account = await accountsService.createAccount(req.body, req.user);
    return successResponse(res, 'Account created successfully', account, 201);
  } catch (error) {
    return errorResponse(res, 'Failed to create account', 500, error);
  }
};

/** PUT /api/accounts/:id */
const updateAccount = async (req, res) => {
  try {
    const account = await accountsService.updateAccount(req.params.id, req.body, req.user);
    return successResponse(res, 'Account updated successfully', account, 200);
  } catch (error) {
    const statusCode = error.message.includes('restricted') || error.message.includes('permission') ? 403 : 500;
    return errorResponse(res, error.message || 'Failed to update account', statusCode, error);
  }
};

module.exports = { getAccounts, getAccountById, createAccount, updateAccount };
