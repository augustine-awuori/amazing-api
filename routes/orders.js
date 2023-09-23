const express = require("express");
const router = express.Router();

const { validateOrder, Order } = require("../models/order");
const auth = require("../middleware/auth");
const mapBuyer = require("../middleware/mapBuyer");
const service = require("../services/order");
const validate = require("../middleware/validate");
const validateSeller = require("../middleware/validateSeller");

router.post(
  "/",
  [auth, validateSeller, mapBuyer, validate(validateOrder)],
  async (req, res) => {
    const order = new Order(req.body);

    await order.save();

    res.send(await service.findById(order._id));
  }
);

module.exports = router;
