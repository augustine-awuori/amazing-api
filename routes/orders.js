const express = require("express");
const router = express.Router();
const { isValidObjectId } = require("mongoose");

const { sendEmail } = require("../services/email");
const { validateOrder, Order } = require("../models/order");
const auth = require("../middleware/auth");
const mapBuyer = require("../middleware/mapBuyer");
const service = require("../services/order");
const userService = require("../services/users");
const validate = require("../middleware/validate");

router.post(
  "/",
  [auth, mapBuyer, validate(validateOrder)],
  async (req, res) => {
    const order = new Order(req.body);

    await order.save();
    const completeOrder = await service.findById(order._id);

    await sendEmail({
      body: "Check the amazing app to see the order details",
      email: completeOrder.shop.author.email,
      subject: "You've received an order",
    });

    res.send(completeOrder);
  }
);

router.get("/:id", auth, async (req, res) => {
  const id = req.params.id;
  if (!isValidObjectId(id))
    return res.status(400).send({ error: "Invalid id" });

  const orders = (await userService.exists(id))
    ? await service.findMyOrders(id)
    : await service.findShopOrders(id);

  res.send(orders);
});

router.get("/single/:id", async (req, res) => {
  const order = await service.findById(req.params.id);

  if (!order)
    return res.status(404).send({ error: "This order doesn't exist" });

  res.send(order);
});

router.patch("/:id", auth, async (req, res) => {
  const order = await service.findById(req.params.id);
  if (!order) return res.status(404).send({ error: "Order not found" });

  const userId = req.user._id.toString();
  const isAuthorised =
    order.buyer._id.toString() === userId ||
    order.shop.author._id.toString() === userId;
  if (!isAuthorised)
    return res.status(403).send({ error: "Unauthorised access" });

  const updatedOrder = await service.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.send(updatedOrder);
});

module.exports = router;
