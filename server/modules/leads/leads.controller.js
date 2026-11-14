//===========================================================================================
//    LEADS MODULE CONTROLLER
//    Orchestrates HTTP requests, schema parsing, user scoping, and responses for leads
//===========================================================================================

const leadsService = require('./leads.service');
const {
  successResponse,
  errorResponse,
} = require('../../common/helpers/response.helper');

/**
 * GET /api/leads - Fetch paginated and filtered leads list scoped by role
 */
const getLeads = async (req, res) => {
  try {
    const result = await leadsService.getLeads(req.query, req.user);
    return successResponse(res, 'Leads fetched successfully', result, 200);
  } catch (error) {
    return errorResponse(res, 'Failed to fetch leads', 500, error);
  }
};

/**
 * GET /api/leads/:id - Fetch single lead by ID scoped by role
 */
const getLeadById = async (req, res) => {
  try {
    const lead = await leadsService.getLeadById(req.params.id, req.user);
    if (!lead) {
      return errorResponse(res, `Lead with ID ${req.params.id} not found or access restricted`, 404);
    }
    return successResponse(res, 'Lead retrieved successfully', lead, 200);
  } catch (error) {
    return errorResponse(res, 'Failed to fetch lead details', 500, error);
  }
};

/**
 * POST /api/leads/check-duplicate - Deduplication pre-save check
 */
const checkDuplicate = async (req, res) => {
  try {
    const { email, phone, companyName } = req.body;
    const result = await leadsService.checkDuplicate({ email, phone, companyName });
    return successResponse(res, 'Deduplication check completed', result, 200);
  } catch (error) {
    return errorResponse(res, 'Failed to perform deduplication check', 500, error);
  }
};

/**
 * POST /api/leads - Create new enterprise lead
 */
const createLead = async (req, res) => {
  try {
    // Normalize field names across various client/form conventions
    const name = (
      req.body.name ||
      req.body.full_name ||
      req.body.fullName ||
      req.body.leadName ||
      ''
    ).trim();

    const email = (
      req.body.email ||
      req.body.primary_email ||
      ''
    ).trim();

    const phone = (
      req.body.phone ||
      req.body.mobile ||
      req.body.contactNumber ||
      req.body.mobile_phone ||
      ''
    ).trim();

    // Fallback company name to person's organization or individual if not specified
    const companyName = (
      req.body.companyName ||
      req.body.company_name ||
      req.body.company ||
      req.body.organizationName ||
      req.body.organization ||
      (name ? `${name}'s Company` : '')
    ).trim();

    // Check mandatory fields with precise error diagnostics
    const missing = [];
    if (!name) missing.push('Full Name (name)');
    if (!email) missing.push('Email Address (email)');
    if (!phone) missing.push('Contact Number (phone)');
    if (!companyName) missing.push('Organization Name (companyName)');

    if (missing.length > 0) {
      return errorResponse(
        res,
        `Missing required field(s): ${missing.join(', ')}`,
        400
      );
    }

    const payload = {
      ...req.body,
      name,
      email,
      phone,
      companyName,
    };

    const newLead = await leadsService.createLead(payload, req.user);
    return successResponse(res, 'Lead created successfully', newLead, 201);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return errorResponse(
        res,
        'A lead with this email or phone number already exists',
        409,
        error
      );
    }
    return errorResponse(res, error.message || 'Failed to create lead', 500, error);
  }
};

/**
 * PUT /api/leads/:id - Update lead details
 */
const updateLead = async (req, res) => {
  try {
    const updatedLead = await leadsService.updateLead(req.params.id, req.body, req.user);
    return successResponse(res, 'Lead updated successfully', updatedLead, 200);
  } catch (error) {
    const statusCode = error.message.includes('unauthorized') || error.message.includes('restricted') ? 403 : 500;
    return errorResponse(res, error.message || 'Failed to update lead', statusCode, error);
  }
};

/**
 * POST /api/leads/:id/convert - Convert qualified lead into Account, Contact, and Deal
 */
const convertLead = async (req, res) => {
  try {
    const conversionResult = await leadsService.convertLead(req.params.id, req.body, req.user);
    return successResponse(
      res,
      'Lead successfully converted to Account, Contact, and Deal',
      conversionResult,
      200
    );
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to convert lead', 400, error);
  }
};

/**
 * GET /api/leads/:id/notes - Get comments/notes for lead
 */
const getLeadNotes = async (req, res) => {
  try {
    const notes = await leadsService.getLeadNotes(req.params.id, req.user);
    return successResponse(res, 'Lead notes fetched successfully', notes, 200);
  } catch (error) {
    return errorResponse(res, 'Failed to fetch lead notes', 500, error);
  }
};

/**
 * POST /api/leads/:id/notes - Add comment/note to lead
 */
const addLeadNote = async (req, res) => {
  try {
    const { noteText, isInternal } = req.body;
    if (!noteText) {
      return errorResponse(res, 'Note text is required', 400);
    }
    const note = await leadsService.addLeadNote(req.params.id, { noteText, isInternal }, req.user);
    return successResponse(res, 'Note added successfully', note, 201);
  } catch (error) {
    return errorResponse(res, 'Failed to add note', 500, error);
  }
};

/**
 * GET /api/leads/:id/activities - Get activity timeline for lead
 */
const getLeadActivities = async (req, res) => {
  try {
    const activities = await leadsService.getLeadActivities(req.params.id, req.user);
    return successResponse(res, 'Lead activities fetched successfully', activities, 200);
  } catch (error) {
    return errorResponse(res, 'Failed to fetch lead activities', 500, error);
  }
};

/**
 * POST /api/leads/:id/activities - Add activity event for lead
 */
const addLeadActivity = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return errorResponse(res, 'Activity title is required', 400);
    }
    const activity = await leadsService.addLeadActivity(req.params.id, req.body, req.user);
    return successResponse(res, 'Activity added successfully', activity, 201);
  } catch (error) {
    return errorResponse(res, 'Failed to log activity', 500, error);
  }
};

module.exports = {
  getLeads,
  getLeadById,
  checkDuplicate,
  createLead,
  updateLead,
  convertLead,
  getLeadNotes,
  addLeadNote,
  getLeadActivities,
  addLeadActivity,
};
