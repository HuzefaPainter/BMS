
const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "bookings",
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  txnid: {
    type: String,
    required: true,
    unique: true // PayU transaction ID, must be unique
  },
  productInfo: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending"
  },
  paymentGateway: {
    type: String,
    default: "payu"  // useful if we ever need to add another gateway
  }
}, { timestamps: true });

module.exports= mongoose.model("transactions", transactionSchema);
