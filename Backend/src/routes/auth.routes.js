const express = require('express');
const router = express.Router();
const validators = require('../middlewares/validators.middleware');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');


// POST /api/auth/register - Register a new user
router.post('/register', validators.registerUserValidations, authController.registerUser);

// POST /api/auth/login - Login user
router.post('/login', validators.loginUserValidations, authController.loginUser);

// GET /api/auth/me - Get current user info
router.get('/me', authMiddleware.authMiddleware, authController.getCurrentUser);

// GET /api/auth/refreshAccessToken - Refresh access token
router.get('/refreshAccessToken', authController.refreshAccessToken);

// GET /api/auth/logout - Logout user
router.get('/logout', authController.logoutUser);


module.exports = router;