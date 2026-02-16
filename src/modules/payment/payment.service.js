const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (userId, amount) => {
  return await razorpay.orders.create({
    amount: amount * 100,
    currency: "INR",
    receipt: "receipt_" + Date.now(),
    notes: {
      userId: userId.toString(),
    },
  });
};

