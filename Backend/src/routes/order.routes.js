const express = require("express");
const router = express.Router();

const orderController = require("../controllers/order.controller");
const authMiddlewares = require("../middlewares/auth.middleware");
const sellerMiddleware = require("../middlewares/seller.middleware");

// Place a new order
router.post("/", authMiddlewares.authMiddleware, orderController.placeOrder);

// place order from cart
router.post("/from-cart", authMiddlewares.authMiddleware, orderController.placeOrderFromCart);

// Get My Orders
router.get("/my-orders", authMiddlewares.authMiddleware, orderController.getMyOrders);

// Get Single Order Details
router.get("/:orderId", authMiddlewares.authMiddleware, orderController.getOrderbyId);

// request return
router.post("/:orderId/request-return", authMiddlewares.authMiddleware, orderController.requestReturn);

// Cancel Order
router.patch("/:orderId/cancel", authMiddlewares.authMiddleware, orderController.cancelOrder);


/* Seller Routes */

// Get all Orders for Seller's Books
router.get("/seller/all-orders", authMiddlewares.authMiddleware, sellerMiddleware, orderController.getSellerOrders);

// Update Order Status (e.g., mark as shipped, delivered)
router.patch("/:orderId/status", authMiddlewares.authMiddleware, sellerMiddleware, orderController.updateOrderStatus);

// Approve Return Request
router.post("/:orderId/approve-return", authMiddlewares.authMiddleware, sellerMiddleware, orderController.approveReturnRequest);

// Reject Return Request
router.post("/:orderId/reject-return", authMiddlewares.authMiddleware, sellerMiddleware, orderController.rejectReturnRequest);


module.exports = router;