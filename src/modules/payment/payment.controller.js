const paymentService = require("./payment.service");

exports.createOrder = async (req, res, next) => {
  try {
    const { amount } = req.body;

    const order = await paymentService.createOrder(amount);

    res.json(order);
  } catch (err) {
    next(err);
  }
};
