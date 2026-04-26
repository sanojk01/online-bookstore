const express = require('express');
const router = express.Router();
const authMiddlewares = require('../middlewares/auth.middleware');
const cartController = require('../controllers/cart.controller');


// add items to cart
router.post('/add', authMiddlewares.authMiddleware, cartController.addToCart);

// get cart items
router.get('/', authMiddlewares.authMiddleware, cartController.getCartItems);

// update cart item quantity
router.patch('/update/:bookId', authMiddlewares.authMiddleware, cartController.updateCartItem);

// remove item from cart
router.delete('/remove/:bookId', authMiddlewares.authMiddleware, cartController.removeCartItem);


module.exports = router;