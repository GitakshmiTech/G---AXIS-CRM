'use strict';

//===========================================================================================
//    CRM LEADS ROUTES
//===========================================================================================

const express = require('express');
const router = express.Router();
const leadsController = require('./leads.controller');

// GET /api/crm/leads
router.get('/', leadsController.getLeads);

module.exports = router;
