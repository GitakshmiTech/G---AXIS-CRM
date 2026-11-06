
const leadsService = require("./leads.service");

const {
  successResponse,
  errorResponse,
} = require("../../common/helpers/response.helper");

const getLeads = async (req, res) => {
  try {
    const leads = await leadsService.getLeads();

    return successResponse(
      res,
      "Leads fetched successfully",
      leads,
      200
    );

  } catch (error) {
    return errorResponse(
      res,
      "Failed to fetch leads",
      500,
      error
    );
  }
};

module.exports = {
  getLeads,
};
