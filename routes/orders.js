const express = require("express");
const router = express.Router();
const { isValidObjectId } = require("mongoose");

const { validateOrder, Order } = require("../models/order");
const auth = require("../middleware/auth");
const mapBuyer = require("../middleware/mapBuyer");
const service = require("../services/order");
const validate = require("../middleware/validate");
const userService = require("../services/users");

router.post(
  "/",
  [auth, mapBuyer, validate(validateOrder)],
  async (req, res) => {
    const order = new Order(req.body);

    await order.save();
    service.sendMessageToShopOwner(order);

    res.send(await service.findById(order._id));
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

module.exports = router;
