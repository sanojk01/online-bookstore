const express = require('express');
const router = express.Router();
const validators = require('../middlewares/validators.middleware');
const addressController = require('../controllers/address.controller');
const authMiddleware = require('../middlewares/auth.middleware');


// POST /api/auth/users/me/addresses - Add user's address
router.post('/addAddress', validators.addAddressValidations, authMiddleware.authMiddleware, addressController.addUserAddress);

// Get /api/auth/users/me/addresses - Get user's addresses
router.get('/', authMiddleware.authMiddleware, addressController.getUserAddress);

// PATCH /api/auth/users/me/addresses - Update user's address
// router.patch('/users/me/addresses', validators.updateAddressValidations, authMiddleware.authMiddleware, addressController.updateUserAddress);

// DELETE /api/auth/users/me/addresses - Delete address
router.delete('/:addressId', authMiddleware.authMiddleware, addressController.deleteUserAddress);

// PATCH /api/auth/users/me/addresses/:addressId/default - Set user's address as default
router.patch('/:addressId/default', authMiddleware.authMiddleware, addressController.setDefaultAddress);

module.exports = router;