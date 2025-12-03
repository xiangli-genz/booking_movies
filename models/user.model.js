const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  tourId: String,
  locationFrom: String,
  seats: [String], // Mảng các ghế đã chọn (V1-1, C1-1, A1-1,...)
  combos: {
    popcorn: { quantity: Number, price: Number, name: String },
    coke: { quantity: Number, price: Number, name: String },
    hotdog: { quantity: Number, price: Number, name: String },
    water: { quantity: Number, price: Number, name: String },
    comboset: { quantity: Number, price: Number, name: String }
  },
  checked: Boolean,
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const schema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    phone: String,
    password: String,
    avatar: String,
    address: String,
    cart: [cartItemSchema],
    status: {
      type: String,
      default: "active"
    },
    deleted: {
      type: Boolean,
      default: false
    },
    deletedBy: String,
    deletedAt: Date
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', schema, "users");

module.exports = User;