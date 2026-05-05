const express = require("express");
const router = express.Router();

const paymentController = require("../controllers/payment.controller");
const authMiddlewares = require("../middlewares/auth.middleware");


// retry payment for an order
router.post("/:orderId/retry", authMiddlewares.authMiddleware, paymentController.retryPayment);

// get payment status for an order
router.get("/:orderId/status", authMiddlewares.authMiddleware, paymentController.getPaymentStatus);





module.exports = router;