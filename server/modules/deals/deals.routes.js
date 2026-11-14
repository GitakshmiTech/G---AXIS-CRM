//===========================================================================================
//    DEALS MODULE ROUTES
//===========================================================================================

const express = require('express');
const router = express.Router();
const dealsController = require('./deals.controller');
const { authenticate } = require('../../middlewares/auth.middleware');

// Protect all deals routes with authentication
router.use(authenticate);

// Pipeline view (before /:id to avoid conflict)
router.get('/pipeline', dealsController.getPipelineSummary);

router.get('/', dealsController.getDeals);
router.get('/:id', dealsController.getDealById);
router.put('/:id', dealsController.updateDeal);
router.patch('/:id/stage', dealsController.updateDealStage);

module.exports = router;
