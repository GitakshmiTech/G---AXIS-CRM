//===========================================================================================
//    CONTACTS MODULE ROUTES
//===========================================================================================

const express = require('express');
const router = express.Router();
const contactsController = require('./contacts.controller');
const { authenticate } = require('../../middlewares/auth.middleware');

// Protect all contacts routes with authentication
router.use(authenticate);

router.get('/', contactsController.getContacts);
router.post('/', contactsController.createContact);
router.get('/:id', contactsController.getContactById);
router.put('/:id', contactsController.updateContact);

module.exports = router;
