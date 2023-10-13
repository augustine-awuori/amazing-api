const Joi = require("joi");
const mongoose = require("mongoose");

module.exports.Order = mongoose.model(
  "Order",
  new mongoose.Schema({
    buyer: { type: mongoose.Types.ObjectId, ref: "User" },
    shop: { type: mongoose.Types.ObjectId, ref: "Shop" },
    message: {
      maxlength: 255,
      trim: true,
      type: String,
    },
    products: [{ type: mongoose.Types.ObjectId, ref: "Product" }],
    canceled: { type: Boolean, default: false },
    seen: { type: Boolean, default: false },
    timestamp: {
      type: Number,
      default: function () {
        return this._id.getTimestamp();
      },
    },
  })
);

module.exports.validateOrder = (order) =>
  Joi.object({
    buyer: Joi.string(),
    shop: Joi.string(),
    message: Joi.string().max(255).allow(""),
    products: Joi.array().min(1),
  }).validate(order);
