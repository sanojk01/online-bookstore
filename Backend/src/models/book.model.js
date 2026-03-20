const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    author: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    price: {
        type: Number,
        required: true
    },

    category: {
        type: String
    },

    stock: {
        type: Number,
        default: 0
    },

    image: {
        type: String
    }
}, { timestamps: true });

const bookModel = mongoose.model('Book', bookSchema);

module.exports = bookModel;