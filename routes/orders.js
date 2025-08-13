const express = require("express");
const Order = require("../models/Order");
const CustomError = require("../errors/custom-error");
const { authenticationMiddleware } = require("../middleware/authentication");
const orderValidations = require("../validations/orderValidations");
const validator = require("../middleware/validator");
const router = express.Router();

router.use(authenticationMiddleware);

router.post("/", orderValidations, validator, async (req, res) => {
  req.body.createdBy = req.user.userId;
  const order = await Order.create(req.body);
  res.status(201).json(order);
});

router.get("/:orderId", async (req, res) => {
  const order = await Order.findById(req.params.orderId);

  if (!order || order.createdBy.toString() !== req.user.userId) {
    throw new CustomError(404, "404 Not Found");
  }
  res.status(200).json(order);
});

router.get("/", async (req, res) => {
  const { userId } = req.user;
  const orders = await Order.find({ createdBy: userId });
  if (orders.length < 1) {
    throw new CustomError(404, "You haven't placed any orders yet.");
  }
  res.status(200).json(orders);
});

module.exports = router;
