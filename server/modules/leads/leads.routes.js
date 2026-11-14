//===========================================================================================
//    LEADS MODULE ROUTES
//===========================================================================================

const express = require('express');
const router = express.Router();
const leadsController = require('./leads.controller');
const { authenticate } = require('../../middlewares/auth.middleware');

// Protect all leads endpoints with authentication
router.use(authenticate);

// Deduplication check endpoint
router.post('/check-duplicate', leadsController.checkDuplicate);

// Lead CRUD operations
router.get('/', leadsController.getLeads);
router.post('/', leadsController.createLead);
router.get('/:id', leadsController.getLeadById);
router.put('/:id', leadsController.updateLead);

// Lead Conversion
router.post('/:id/convert', leadsController.convertLead);

// Lead Notes & Comments
router.get('/:id/notes', leadsController.getLeadNotes);
router.post('/:id/notes', leadsController.addLeadNote);

// Lead Activities & Timeline
router.get('/:id/activities', leadsController.getLeadActivities);
router.post('/:id/activities', leadsController.addLeadActivity);

module.exports = router;
