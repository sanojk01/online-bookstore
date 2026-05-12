const processDummyPayment = require("../utils/dummyPayment");
const orderModel = require("../models/order.model");
const bookModel = require("../models/book.model");
const cartModel = require("../models/cart.model");

// Place a new order
async function placeOrder(req, res) {
  try {
    const user = req.user;
    const { bookId, quantity, paymentMethod, paymentDetails } = req.body;

    const qty = Number(quantity);

    if (!bookId || isNaN(qty) || qty <= 0) {
      return res.status(400).json({ message: "Invalid book ID or quantity" });
    }

    // Check if user has at least one address

    if (!user.addresses || user.addresses.length === 0) {
      return res
        .status(400)
        .json({
          message: "Please add a shipping address before placing an order",
        });
    }

    const userAddress = user.addresses.find((addr) => addr.isDefault) || user.addresses[0];

    if (!userAddress) {
      return res
        .status(400)
        .json({ message: "No valid shipping address found" });
    }

    // STEP 1: Validate all items first ─────────

    const book = await bookModel.findById(bookId);

    if (!book) {
      return res
        .status(404)
        .json({ message: `Book with ID ${bookId} not found` });
    }

    if (book.stock < qty) {
      return res
        .status(400)
        .json({
          message: `Insufficient stock for "${book.title}". Available: ${book.stock}`,
        });
    }

    if (book.seller.toString() === user._id.toString()) {
      return res
        .status(400)
        .json({ message: `You cannot order your own book: "${book.title}"` });
    }

    // Calculate total price
    const totalPrice = book.price * qty;


    // STEP 2: Create the order ─────────

    const newOrder = await orderModel.create({
      buyer: user._id,
      items: [
        {
          book: book._id,
          quantity: qty,
          price: book.price,
        },
      ],
      totalPrice,
      shippingAddress: userAddress,
      status: "pending",
      paymentStatus: "unpaid",
      paymentInfo: {},
    });


    // ── STEP 3: Populate Response ─────

    await newOrder.populate("items.book", "title price");

    res.status(201).json({
      message: "Order created. Please complete payment to confirm.",
      order: newOrder,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error placing order", error: error.message });
  }
}

// Place order from cart
async function placeOrderFromCart(req, res) {
  try {
    const user = req.user;

    const cart = await cartModel
      .findOne({ user: user._id })
      .populate("items.book");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    // Check if user has at least one address

    if (!user.addresses || user.addresses.length === 0) {
      return res
        .status(400)
        .json({
          message: "Please add a shipping address before placing an order",
        });
    }

    const userAddress =
      user.addresses.find((addr) => addr.isDefault) || user.addresses[0];

    if (!userAddress) {
      return res
        .status(400)
        .json({ message: "No valid shipping address found" });
    }

    // Validate all items in the cart

    let totalPrice = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const book = item.book;

      if (!book) {
        return res
          .status(404)
          .json({ message: `Book with ID ${item.book} not found` });
      }

      if (book.stock < item.quantity) {
        return res
          .status(400)
          .json({
            message: `Insufficient stock for "${book.title}". Available: ${book.stock}`,
          });
      }

      if (book.seller.toString() === user._id.toString()) {
        return res
          .status(400)
          .json({ message: `You cannot order your own book: "${book.title}"` });
      }

      orderItems.push({
        book: book._id,
        quantity: item.quantity,
        price: book.price,
      });

      totalPrice += book.price * item.quantity;
    }

    // Create the order

    const newOrder = await orderModel.create({
      buyer: user._id,
      items: orderItems,
      totalPrice,
      shippingAddress: userAddress,
      status: "pending",
      paymentStatus: "unpaid",
      paymentInfo: {},
    });

    // Clear the cart

    cart.items = [];
    await cart.save();

    // Populate response
    await newOrder.populate("items.book", "title price");

    res.status(201).json({
      message: "Order created. Please complete payment to confirm.",
      order: newOrder,
    });
    
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error placing order from cart", error: error.message });
  }
}

// Get My Orders
async function getMyOrders(req, res) {
  try {
    let { page = 1, limit = 10 } = req.query;

    page = Number(page);
    limit = Number(limit);

    if (isNaN(page) || page <= 0) {
      return res.status(400).json({ message: "Invalid page number" });
    }

    if (isNaN(limit) || limit <= 0 || limit > 50) {
      return res.status(400).json({ message: "Invalid limit value (1-50)" });
    }

    const skip = (page - 1) * limit;

    const [total, orders] = await Promise.all([
      orderModel.countDocuments({ buyer: req.user._id }),
      orderModel
        .find({ buyer: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("items.book", "title price"),
    ]);

    const totalPages = Math.ceil(total / limit);

    if (page > totalPages && totalPages > 0) {
      return res.status(400).json({ message: "Page number exceeds total pages" });
    }

    res.status(200).json({
      message: "Orders retrieved successfully",
      orders,
      total,
      page,
      totalPages,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving orders", error: error.message });
  }
}

// Get Single Order Details
async function getOrderbyId(req, res) {
  try {
    const { orderId } = req.params;

    const order = await orderModel
      .findById(orderId)
      .populate("items.book", "title price")
      .populate("buyer", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.buyer._id.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to view this order" });
    }

    res.status(200).json({
      message: "Order details retrieved successfully",
      order,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error retrieving order details",
        error: error.message,
      });
  }
}

// Request Return
async function requestReturn(req, res) {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;

    if (!reason || reason.trim().length < 10) {
      return res.status(400).json({ message: "Please provide a valid reason for return (at least 10 characters)" });
    }

    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Only the buyer can request a return for their order
    if (order.buyer.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to request a return for this order" });
    }

    if (order.status !== "delivered") {
      return res
        .status(400)
        .json({ message: "Only delivered orders can be returned" });
    }

    if (order.returnRequested) {
      return res.status(400).json({ message: "Return already requested" });
    }

    order.returnRequested = true;
    order.returnRequestedAt = new Date();
    order.returnReason = reason || "No reason provided";

    await order.save();

    res.status(200).json({ message: "Return request submitted successfully", order });

  } catch (error) {
    res.status(500).json({ message: "Error requesting return", error: error.message });
  }

}

// Cancel Order
async function cancelOrder(req, res) {
  try {
    const { orderId } = req.params;

    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.buyer.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to cancel this order" });
    }

    if (order.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Only pending orders can be cancelled" });
    }

    order.status = "cancelled";
    order.cancelledAt = new Date();

    if (order.paymentStatus === "paid") {
      order.paymentStatus = "refunded";
    }

    await order.save();

    // Restore stock for each book in the order

    for (const item of order.items) {
      const book = await bookModel.findById(item.book);

      if (book) {
        book.stock += item.quantity;
        await book.save();
      }
    }

    res.status(200).json({ message: "Order cancelled successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error cancelling order", error: error.message });
  }
}

/* Seller Controllers */

// Get all Orders for Seller's Books
async function getSellerOrders(req, res) {
  try {
    let { status, page = 1, limit = 10 } = req.query;

    page = Number(page);
    limit = Number(limit);

    if (isNaN(page) || page <= 0) {
      return res.status(400).json({ message: "Invalid page number" });
    }

    if (isNaN(limit) || limit <= 0 || limit > 50) {
      return res.status(400).json({ message: "Invalid limit value (1-50)" });
    }

    const allowedStatus = ["pending", "shipped", "delivered", "returned", "cancelled"];

    if (status && !allowedStatus.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Allowed values: ${allowedStatus.join(', ')}` });
    }

    // find all books sold by this seller

    const myBooks = await bookModel
      .find({ seller: req.user._id })
      .select("_id");

    const bookIds = myBooks.map((book) => book._id);

    if (bookIds.length === 0) {
      return res.status(200).json({
        message: "No orders found for your books",
        total: 0,
        page,
        totalPages: 0,
        orders: [],
      });
    }

    const filter = { "items.book": { $in: bookIds } };

    if (status) filter.status = status;

    const skip = (page - 1) * limit;
    
    const [total, orders] = await Promise.all([
      orderModel.countDocuments(filter),
      orderModel.find(filter)
        .populate("items.book", "title price")
        .populate("buyer", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
    ]);

    const totalPages = Math.ceil(total / limit);

    if (page > totalPages && totalPages > 0) {
      return res.status(400).json({ message: "Page number exceeds total pages" });
    }

    res.status(200).json({
      message: "Seller orders retrieved successfully",
      total,
      page,
      totalPages,
      orders,
    });

  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error retrieving seller orders",
        error: error.message,
      });
  }
}

// Update Order Status (e.g., mark as shipped, delivered)
async function updateOrderStatus(req, res) {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const allowedStatus = [
      "pending",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (
      !status ||
      !allowedStatus.includes(status)
    ) {
      return res.status(400).json({
        message: `Invalid status. Allowed values: ${allowedStatus.join(", ")}`,
      });
    }

    const order =
      await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const myBooks =
      await bookModel
        .find({
          seller: req.user._id,
        })
        .select("_id");

    const bookIds = new Set(
      myBooks.map((book) =>
        book._id.toString()
      )
    );

    const isSellerOrder =
      order.items.some((item) =>
        bookIds.has(
          item.book.toString()
        )
      );

    if (!isSellerOrder) {
      return res.status(403).json({
        message:
          "You are not authorized to update this order's status",
      });
    }

    const terminalStatuses = [
      "delivered",
      "cancelled",
      "returned",
    ];

    if (
      terminalStatuses.includes(
        order.status
      )
    ) {
      return res.status(400).json({
        message: `Cannot update an order that is already "${order.status}"`,
      });
    }

    const statusOrder = [
      "pending",
      "shipped",
      "delivered",
    ];

    const currentIndex =
      statusOrder.indexOf(order.status);

    const newIndex =
      statusOrder.indexOf(status);

    if (status !== "cancelled") {

      if (newIndex < currentIndex) {
        return res.status(400).json({
          message: `Cannot move status back from "${order.status}" to "${status}"`,
        });
      }

      if (
        newIndex >
        currentIndex + 1
      ) {
        return res.status(400).json({
          message: `Cannot skip status. Current: "${order.status}", next allowed: "${statusOrder[currentIndex + 1]}"`,
        });
      }
    }

    if (status === "delivered") {

      order.deliveredAt =
        new Date();

      order.paymentStatus =
        "paid";
    }

    if (status === "cancelled") {

      await Promise.all(
        order.items.map((item) => {

          const bookId =
            item.book?._id ||
            item.book;

          return bookModel.updateOne(
            { _id: bookId },
            {
              $inc: {
                stock:
                  item.quantity,
              },
            }
          );
        })
      );

      order.cancelledAt = new Date();

        if (order.paymentStatus === "paid") {
          order.paymentStatus = "refunded";
        }
    }

    order.status = status;

    await order.save();

    const populatedOrder =
      await orderModel
        .findById(order._id)
        .populate(
          "items.book",
          "title price"
        );

    return res.status(200).json({
      message:
        "Order status updated successfully",

      order: populatedOrder,
    });

  } catch (error) {

    console.error(
      "updateOrderStatus error:",
      error
    );

    return res.status(500).json({
      message:
        "Error updating order status",

      error: error.message,
    });
  }
}

// Approve Return Request
async function approveReturnRequest(req, res) {
  try {
    const { orderId } = req.params;

    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const myBooks = await bookModel.find({ seller: req.user._id }).select("_id");
    const bookIds = myBooks.map((book) => book._id.toString());

    const isSellerOrder = order.items.some((item) => bookIds.includes(item.book.toString()));

    if (!isSellerOrder) {
      return res.status(403).json({ message: "You are not authorized to approve return for this order" });
    }

    if (!order.returnRequested) {
      return res.status(400).json({ message: "No return request found for this order" });
    }

     if(order.returnApproved) {
      return res.status(400).json({ message: "Return request has already been approved" });
    }

    if(order.paymentStatus !== "paid") {
      return res.status(400).json({ message: "Order not eligible for refund" });
    }

    order.returnApproved = true;
    order.returnApprovedAt = new Date();
    order.status = "returned";

      // Restore stock for each book in the order

     await Promise.all(order.items.map(async (item) => {
        const book = await bookModel.findById(item.book);
        if (book) {
            book.stock += item.quantity;
            await book.save();
        }
    }));

    order.paymentStatus = "refunded";

    order.refundInfo = {
      refundId: `REFUND${Date.now()}${Math.floor(Math.random() * 1000)}`,
      amount: order.totalPrice,
      reason: order.returnReason || "No reason provided",
      refundedAt: new Date(),
    };

    await order.save();

    res.status(200).json({ 
        message:  "Return request approved and refund completed",
        order 
    });

  } catch (error) {
    res.status(500).json({ message: "Error processing return request", error: error.message });
  }

}

// Reject Return Request
async function rejectReturnRequest(req, res) {
  try {
    const { orderId } = req.params;

    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const myBooks = await bookModel.find({ seller: req.user._id }).select("_id");
    const bookIds = myBooks.map((book) => book._id.toString());

    const isSellerOrder = order.items.some((item) => bookIds.includes(item.book.toString()));

    if (!isSellerOrder) {
      return res.status(403).json({ message: "You are not authorized to reject return for this order" });
    }

    if (!order.returnRequested) {
      return res.status(400).json({ message: "No return request found for this order" });
    }

    if(order.returnApproved) {
      return res.status(400).json({ message: "Return request has already been approved, cannot reject" });
    }

    order.returnRequested = false;
    order.returnReason = "";
    order.returnRequestedAt = null;

    await order.save();

    res.status(200).json({ 
        message: "Return request rejected",
        order
    });

  } catch (error) {
    res.status(500).json({ message: "Error processing return rejection", error: error.message });
  }

}




module.exports = {
  placeOrder,
  placeOrderFromCart,
  getMyOrders,
  getOrderbyId,
  requestReturn,
  cancelOrder,
  getSellerOrders,
  updateOrderStatus,
  approveReturnRequest,
  rejectReturnRequest,
};
