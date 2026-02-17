const crypto = require("crypto");

exports.handleWebhook = async (req, res) => {
  try {
    const signature = req.headers["x-razorpay-signature"];

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (signature !== expectedSignature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    const event = req.body.event;

    if (event === "payment.captured") {
      const paymentData = req.body.payload.payment.entity;

      await Payment.findOneAndUpdate(
        { orderId: paymentData.order_id },
        {
          paymentId: paymentData.id,
          status: "paid",
        }
      );
    }

    res.status(200).json({ received: true });

  } catch (error) {
    console.error("Webhook Error:", error.message);
    res.status(400).json({ error: "Webhook failed" });
  }
};
