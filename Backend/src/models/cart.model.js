const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },

    items: [
        {
            book: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Book",
                required: true
            },

            quantity: {
                type: Number,
                default: 1
            }
        }
    ]
}, { timestamps: true });

const cartModel = mongoose.model('Cart', cartSchema);

module.exports = cartModel;