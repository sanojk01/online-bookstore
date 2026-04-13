const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  street: {
    type: String
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  pincode: {
    type: String,
    required: true
  },
  country: {
    type: String,
    default: "India"
  },
  isDefault: {
    type: Boolean,
    default: false
  }
});

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
        select: false
    },

    gender: {
        type: String,
        enum: ["male", "female", "other"],
        default: "male"
    },

    role: {
        type: String,
        enum: ["user", "seller"],
        default: "user"
    },
    addresses: [addressSchema]
    
}, { timestamps: true });

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;