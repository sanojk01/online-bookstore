const orderModel = require("../models/order.model");
const bookModel = require("../models/book.model");
const processDummyPayment = require("../utils/dummyPayment");


async function payOrder(req, res) {
  try {
    const { orderId } = req.params;
    const { paymentMethod, paymentDetails } = req.body;
 
    const allowedMethods = ["card", "upi", "netbanking"];
 
    if (!paymentMethod || !allowedMethods.includes(paymentMethod)) {
      return res.status(400).json({
        message: `Invalid payment method. Allowed: ${allowedMethods.join(", ")}`,
      });
    }
 
    const order = await orderModel.findById(orderId);
 
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
 
    // Only the buyer can pay for their own order
    if (order.buyer.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to pay for this order" });
    }
 
    // Only unpaid or failed-payment orders can be retried
    if (!["unpaid", "failed"].includes(order.paymentStatus)) {
      return res.status(400).json({
        message: `Order is already in payment status: "${order.paymentStatus}"`,
      });
    }
 
    // Order must still be in pending state
    if (order.status !== "pending") {
      return res.status(400).json({
        message: `Cannot pay for an order with status: "${order.status}"`,
      });
    }
 
    // Re-validate stock before charging
    for (const item of order.items) {
      const book = await bookModel.findById(item.book);
 
      if (!book) {
        return res.status(404).json({
          message: `Book with ID ${item.book} no longer exists`,
        });
      }
 
      if (book.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for "${book.title}". Available: ${book.stock}`,
        });
      }
    }
 
    // Process payment
    const paymentResult = processDummyPayment(paymentMethod, paymentDetails);
 
    if (!paymentResult.success) {
      // Update payment info with failure details but keep order alive for retry
      order.paymentStatus = "failed";
      order.paymentInfo = {
        paymentMethod,
        failureReason: paymentResult.reason,
      };
      await order.save();
 
      return res.status(402).json({
        message: "Payment failed",
        reason: paymentResult.reason,
        order,
      });
    }
 
    // Payment succeeded — update order
    order.paymentStatus = "paid";
    order.paymentInfo = {
      paymentMethod,
      transactionId: `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`,
      paidAt: new Date(),
      failureReason: null,
    };
 
    await order.save();
 
    // Reduce stock for each book now that payment is confirmed
    for (const item of order.items) {
      const book = await bookModel.findById(item.book);
      if (book) {
        book.stock -= item.quantity;
        await book.save();
      }
    }
 
    await order.populate("items.book", "title price");
 
    return res.status(200).json({
      message: "Payment successful",
      order,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error processing payment", error: error.message });
  }
}


async function retryPayment(req, res) {
  try {
    const user = req.user;
    const { orderId } = req.params;
    const { paymentMethod, paymentDetails } = req.body;

    const allowedMethods = ["card", "upi", "netbanking"];

    if (!paymentMethod || !allowedMethods.includes(paymentMethod)) {
      return res.status(400).json({ message: `Invalid payment method. Allowed: ${allowedMethods.join(', ')}` });
    }

    const order = await orderModel.findById(orderId).populate("items.book");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.buyer.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (order.paymentStatus === "paid") {
      return res.status(400).json({ message: "Payment already completed" });
    }

    if (order.paymentStatus === "cancelled") {
        return res.status(400).json({ message: "Cannot retry payment for a cancelled order" });
    }

    const paymentResult = processDummyPayment(paymentMethod, paymentDetails);

    if(!paymentResult.success) {
      order.paymentStatus = "failed";
      order.paymentInfo = {
        paymentMethod,
        failureReason: paymentResult.reason,
      }

      await order.save();

      return res.status(400).json({
          message: `Payment failed on retry: ${paymentResult.reason}`,
          order,
      });

    }

      order.paymentStatus = "paid";
      order.paymentInfo = {
        paymentMethod,
        transactionId: `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`,
        paidAt: new Date(),
        failureReason: null,
      }

      // Reduce stock for each book
        for (const item of order.items) {
              const book = item.book;

              if (book.stock < item.quantity) {
                  return res.status(400).json({ message: `Insufficient stock for ${book.title}. Available: ${book.stock}` });
              }

              book.stock -= item.quantity;
              await book.save();
        }


    await order.save();

    res.status(200).json({
      message: paymentResult.success
        ? "Payment successful on retry"
        : `Payment failed on retry: ${paymentResult.reason}`,
      order,
    });

  } catch (error) {
    console.error("Error in retryPayment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

async function getPaymentStatus(req, res) {
  try {
    const user = req.user;
    const { orderId } = req.params;

    const order = await orderModel.findById(orderId).select("paymentStatus paymentInfo totalPrice buyer");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.buyer.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.status(200).json({
      paymentStatus: order.paymentStatus,
      transactionId: order.paymentInfo?.transactionId || null,
      paymentMethod: order.paymentInfo?.paymentMethod || null,
      paidAt: order.paymentInfo?.paidAt || null,
      failureReason: order.paymentInfo?.failureReason || null,
      totalPrice: order.totalPrice,
    });

  } catch (error) {
    console.error("Error in getPaymentStatus:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}




module.exports = {
  payOrder,
  retryPayment,
  getPaymentStatus,
};