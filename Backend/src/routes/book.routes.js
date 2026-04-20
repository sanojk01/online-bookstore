const express = require('express');
const router = express.Router();

const bookController = require('../controllers/book.controller');
const authMiddlewares = require('../middlewares/auth.middleware');
const sellerMiddleware = require('../middlewares/seller.middleware');
const validators = require('../middlewares/validators.middleware');
const upload = require('../middlewares/upload.middleware');



// Get all books
router.get('/', bookController.getBooks);

// Get a single book by ID
router.get('/:id', bookController.getBookById);


/* Seller only */

// Create a new book
router.post('/', authMiddlewares.authMiddleware, sellerMiddleware, upload.array('images', 5), validators.createBookValidations, bookController.createBook);

// Get all books of the logged-in seller
router.get('/seller/my-books', authMiddlewares.authMiddleware, sellerMiddleware, bookController.getMyBooks);

// Update a book by ID
router.patch('/:id', authMiddlewares.authMiddleware, sellerMiddleware, upload.array('images', 5), bookController.updateBook);

// Delete a book by ID
router.delete('/:id', authMiddlewares.authMiddleware, sellerMiddleware, bookController.deleteBook);



module.exports = router;