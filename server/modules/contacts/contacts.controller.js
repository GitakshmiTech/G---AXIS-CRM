//===========================================================================================
//    CONTACTS MODULE CONTROLLER
//    Handles HTTP requests for contacts with role-scoped querying
//===========================================================================================

const contactsService = require('./contacts.service');
const { successResponse, errorResponse } = require('../../common/helpers/response.helper');

/** GET /api/contacts */
const getContacts = async (req, res) => {
  try {
    const result = await contactsService.getContacts(req.query, req.user);
    return successResponse(res, 'Contacts fetched successfully', result, 200);
  } catch (error) {
    return errorResponse(res, 'Failed to fetch contacts', 500, error);
  }
};

/** GET /api/contacts/:id */
const getContactById = async (req, res) => {
  try {
    const contact = await contactsService.getContactById(req.params.id, req.user);
    if (!contact) return errorResponse(res, `Contact ${req.params.id} not found or access restricted`, 404);
    return successResponse(res, 'Contact retrieved successfully', contact, 200);
  } catch (error) {
    return errorResponse(res, 'Failed to fetch contact', 500, error);
  }
};

/** POST /api/contacts */
const createContact = async (req, res) => {
  try {
    const { firstName, email, accountId } = req.body;
    if (!firstName || !email || !accountId) {
      return errorResponse(res, 'First name, email, and account are required', 400);
    }
    const contact = await contactsService.createContact(req.body, req.user);
    return successResponse(res, 'Contact created successfully', contact, 201);
  } catch (error) {
    return errorResponse(res, 'Failed to create contact', 500, error);
  }
};

/** PUT /api/contacts/:id */
const updateContact = async (req, res) => {
  try {
    const contact = await contactsService.updateContact(req.params.id, req.body, req.user);
    return successResponse(res, 'Contact updated successfully', contact, 200);
  } catch (error) {
    const statusCode = error.message.includes('restricted') || error.message.includes('permission') ? 403 : 500;
    return errorResponse(res, error.message || 'Failed to update contact', statusCode, error);
  }
};

module.exports = { getContacts, getContactById, createContact, updateContact };
