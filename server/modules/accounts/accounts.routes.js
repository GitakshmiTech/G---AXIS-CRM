//===========================================================================================
//    ACCOUNTS MODULE ROUTES
//===========================================================================================

const express = require('express');
const router = express.Router();
const accountsController = require('./accounts.controller');
const { authenticate } = require('../../middlewares/auth.middleware');

// Protect all accounts routes with authentication
router.use(authenticate);

router.get('/', accountsController.getAccounts);
router.post('/', accountsController.createAccount);
router.get('/:id', accountsController.getAccountById);
router.put('/:id', accountsController.updateAccount);

module.exports = router;
