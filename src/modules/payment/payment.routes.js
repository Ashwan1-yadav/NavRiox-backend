const router = require("express").Router();
const paymentController = require("./payment.controller");
const paymentWebhook = require("./payment.webhook");
const { protect } = require("../../middleware/auth.middleware");

router.post("/create-order", protect, paymentController.createOrder);
router.post("/webhook", paymentWebhook.handleWebhook);

module.exports = router;
