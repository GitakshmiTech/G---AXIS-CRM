//===========================================================================================
//    DEALS MODULE CONTROLLER
//    Handles HTTP requests for deals with role-scoped querying
//===========================================================================================

const dealsService = require('./deals.service');
const { successResponse, errorResponse } = require('../../common/helpers/response.helper');

/** GET /api/deals */
const getDeals = async (req, res) => {
  try {
    const result = await dealsService.getDeals(req.query, req.user);
    return successResponse(res, 'Deals fetched successfully', result, 200);
  } catch (error) {
    return errorResponse(res, 'Failed to fetch deals', 500, error);
  }
};

/** GET /api/deals/pipeline */
const getPipelineSummary = async (req, res) => {
  try {
    const summary = await dealsService.getPipelineSummary(req.user);
    return successResponse(res, 'Pipeline summary fetched', summary, 200);
  } catch (error) {
    return errorResponse(res, 'Failed to fetch pipeline', 500, error);
  }
};

/** GET /api/deals/:id */
const getDealById = async (req, res) => {
  try {
    const deal = await dealsService.getDealById(req.params.id, req.user);
    if (!deal) return errorResponse(res, `Deal ${req.params.id} not found or access restricted`, 404);
    return successResponse(res, 'Deal retrieved successfully', deal, 200);
  } catch (error) {
    return errorResponse(res, 'Failed to fetch deal', 500, error);
  }
};

/** PUT /api/deals/:id */
const updateDeal = async (req, res) => {
  try {
    const deal = await dealsService.updateDeal(req.params.id, req.body, req.user);
    return successResponse(res, 'Deal updated successfully', deal, 200);
  } catch (error) {
    const statusCode = error.message.includes('restricted') || error.message.includes('permission') ? 403 : 500;
    return errorResponse(res, error.message || 'Failed to update deal', statusCode, error);
  }
};

/** PATCH /api/deals/:id/stage */
const updateDealStage = async (req, res) => {
  try {
    const { stageId } = req.body;
    if (!stageId) return errorResponse(res, 'stageId is required', 400);
    const deal = await dealsService.updateDealStage(req.params.id, stageId, req.user);
    return successResponse(res, 'Deal stage updated', deal, 200);
  } catch (error) {
    const statusCode = error.message.includes('restricted') || error.message.includes('permission') ? 403 : 500;
    return errorResponse(res, error.message || 'Failed to update deal stage', statusCode, error);
  }
};

module.exports = { getDeals, getDealById, getPipelineSummary, updateDeal, updateDealStage };
