const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  street: String,
  city: String,
  state: String,
  pincode: String,
  country: String,
  isDefault: { type: Boolean, default: false },
});

const orderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        book: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Book",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity must be at least 1"],
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],

    totalPrice: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "shipped", "delivered", "returned", "cancelled"],
      default: "pending",
    },

    shippingAddress: addressSchema,

    paymentStatus: {
      type: String,
      enum: ["unpaid", "failed", "paid", "refunded"],
      default: "unpaid",
    },

    paymentInfo: {
      transactionId: String,
      paymentMethod: String,
      paidAt: Date,
      failureReason: String,
    },

    returnRequested: {
      type: Boolean,
      default: false,
    },

    returnApproved: {
      type: Boolean,
      default: false,
    },

    returnReason: String,
    returnRequestedAt: Date,
    returnApprovedAt: Date,

    refundInfo: {
      refundId: String,
      amount: Number,
      reason: String,
      refundedAt: Date,
    },

    cancelledAt: {
      type: Date,
    },

    deliveredAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

const orderModel = mongoose.model("Order", orderSchema);

module.exports = orderModel;
