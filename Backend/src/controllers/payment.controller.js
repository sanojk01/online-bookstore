const orderModel = require("../models/order.model");
const processDummyPayment = require("../utils/dummyPayment");

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
  retryPayment,
  getPaymentStatus,
};