const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    razorpayOrderId: {
      type: String,
      required: true,
      index: true,
    },
    razorpayPaymentId: {
      type: String,
      unique: true,
      sparse: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: Number,
    currency: String,
    status: {
      type: String,
      enum: ["CREATED", "SUCCESS", "FAILED"],
      default: "CREATED",
    },
    eventId: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
