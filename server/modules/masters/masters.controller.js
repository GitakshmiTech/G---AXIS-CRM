//===========================================================================================
//    MASTERS MODULE CONTROLLER
//===========================================================================================

const mastersService = require('./masters.service');
const {
  successResponse,
  errorResponse,
} = require('../../common/helpers/response.helper');

/**
 * GET /api/masters/lead-options
 * Returns consolidated dropdown choices for leads, stages, priorities, sources, industries
 */
const getLeadOptions = async (req, res) => {
  try {
    const options = await mastersService.getLeadOptions();
    return successResponse(res, 'Master options retrieved successfully', options, 200);
  } catch (error) {
    return errorResponse(res, 'Failed to fetch master options', 500, error);
  }
};

module.exports = {
  getLeadOptions,
};

