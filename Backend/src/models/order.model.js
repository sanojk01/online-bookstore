const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    books: [
        {
            book: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Book"
            },
            quantity: {
                type: Number,
                default: 1
            }
        }
    ],

    totalPrice: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        enum: ["pending", "shipped", "delivered"],
        default: "pending"
    }
    
}, { timestamps: true });


const orderModel = mongoose.model('Order', orderSchema);

module.exports = orderModel;