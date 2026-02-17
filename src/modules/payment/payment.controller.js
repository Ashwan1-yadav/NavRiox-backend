const razorpay = require("../../config/razorpay");
const Payment = require("../../models/payment.model");

exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const userId = req.user?.id || req.body.userId;
    console.log(userId);

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Valid amount required" });
    }

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    const payment = await Payment.create({
      user: userId,
      orderId: order.id,
      amount: amount,
      currency: order.currency,
      status: "created",
    });

    res.status(200).json({
      success: true,
      message: "Order created successfully",
      order,
      payment,
    });

  } catch (error) {
    console.error("Create order Error:", error.response?.data || error.message);
  
    return res.status(500).json({
      success: false,
      message: error.response?.data?.error?.description || error.message,
    });
  }  
};
