const crypto = require("crypto");
const Payment = require("../../models/payment.model");
const User = require("../../models/user.model");

exports.handleWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    const signature = req.headers["x-razorpay-signature"];

    if (!signature) {
      return res.status(400).json({ message: "Missing signature" });
    }

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(req.body)
      .digest("hex");

    if (signature !== expectedSignature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    const event = JSON.parse(req.body.toString());

    const eventId = event.id;

    const existingEvent = await Payment.findOne({ eventId });
    if (existingEvent) {
      return res.status(200).json({ message: "Event already processed" });
    }

   
    if (event.event === "payment.captured") {
      const paymentEntity = event.payload.payment.entity;

      const {
        id: razorpayPaymentId,
        order_id: razorpayOrderId,
        amount,
        currency,
        notes,
      } = paymentEntity;

      const userId = notes?.userId;

      if (!userId) {
        return res.status(400).json({ message: "UserId missing in notes" });
      }

      let payment = await Payment.findOne({ razorpayOrderId });

      if (!payment) {
        payment = await Payment.create({
          razorpayOrderId,
          razorpayPaymentId,
          userId,
          amount,
          currency,
          status: "SUCCESS",
          eventId,
        });
      } else {
        payment.status = "SUCCESS";
        payment.razorpayPaymentId = razorpayPaymentId;
        payment.eventId = eventId;
        await payment.save();
      }

      const user = await User.findById(userId);

      if (user) {
        const now = new Date();
        const expiry = new Date();
        expiry.setMonth(expiry.getMonth() + 1);

        user.subscription = {
          plan: "PRO",
          status: "ACTIVE",
          expiresAt: expiry,
        };

        await user.save();
      }
    }

   
    if (event.event === "payment.failed") {
      const paymentEntity = event.payload.payment.entity;

      await Payment.create({
        razorpayOrderId: paymentEntity.order_id,
        razorpayPaymentId: paymentEntity.id,
        userId: paymentEntity.notes?.userId,
        amount: paymentEntity.amount,
        currency: paymentEntity.currency,
        status: "FAILED",
        eventId,
      });
    }

    return res.status(200).json({ received: true });

  } catch (error) {
    console.error("Webhook Error:", error);
    return res.status(500).json({ message: "Internal webhook error" });
  }
};
