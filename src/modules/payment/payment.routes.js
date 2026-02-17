const express = require("express");
const router = express.Router();
const { createOrder } = require("../../modules/payment/payment.controller");
const { handleWebhook } = require("../../modules/payment/payment.webhook");
const { protect } = require("../../middleware/auth.middleware")

router.post("/create-order",protect, createOrder);
router.post(
  "/webhook",
  express.json({ verify: (req, res, buf) => (req.rawBody = buf) }),
  handleWebhook
);

module.exports = router;
