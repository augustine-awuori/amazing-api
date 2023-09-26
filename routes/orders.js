const express = require("express");
const router = express.Router();

const { validateOrder, Order } = require("../models/order");
const auth = require("../middleware/auth");
const mapBuyer = require("../middleware/mapBuyer");
const service = require("../services/order");
const validate = require("../middleware/validate");

router.post(
  "/",
  [auth, mapBuyer, validate(validateOrder)],
  async (req, res) => {
    const order = new Order(req.body);

    await order.save();

    res.send(await service.findById(order._id));
  }
);

router.get("/my/:id", auth, async (req, res) => {
  const myOrders = await service.findMyOrders(req.params.id);

  if (!myOrders) return res.status(400).send({ error: "Invalid user id" });

  res.send(myOrders);
});

router.get("/shop/:id", auth, async (req, res) => {
  const shopOrders = await service.findShopOrders(req.params.id);

  if (!shopOrders) return res.status(400).send({ error: "Invalid shop id" });

  res.send(shopOrders);
});

module.exports = router;
