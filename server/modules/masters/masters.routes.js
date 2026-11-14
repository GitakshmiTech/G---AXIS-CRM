//===========================================================================================
//    MASTERS MODULE ROUTES
//===========================================================================================

const express = require('express');
const router = express.Router();
const mastersController = require('./masters.controller');

router.get('/lead-options', mastersController.getLeadOptions);

module.exports = router;

