//===========================================================================================
//    AUTH MODULE ROUTES
//    Route definitions for authentication endpoints
//===========================================================================================

const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const { authenticate } = require('../../middlewares/auth.middleware');

// Public route
router.post('/login', authController.login);

// Authenticated session routes
router.get('/me', authenticate, authController.getMe);
router.get('/staff', authenticate, authController.getStaffDirectory);

module.exports = router;

