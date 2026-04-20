const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    price: {
      type: Number,
      required: true,
    },

    stock: {
      type: Number,
      default: 0,
    },

    category: {
      type: String,
    },

    images: [
      {
        url: { type: String },
        fileId: { type: String },
        thumbnailUrl: { type: String },
      },
    ],

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

bookSchema.index({ title: "text", description: "text" });

const bookModel = mongoose.model("Book", bookSchema);

module.exports = bookModel;
