const Joi = require("joi");
const mongoose = require("mongoose");

module.exports.Order = mongoose.model(
  "Order",
  new mongoose.Schema({
    buyer: { type: mongoose.Types.ObjectId, ref: "User" },
    shop: { type: mongoose.Types.ObjectId, ref: "Shop" },
    status: { type: mongoose.Types.ObjectId, ref: "Status" },
    message: {
      maxlength: 255,
      trim: true,
      type: String,
    },
    products: Object,
    canceled: { type: Boolean, default: false },
    seenBySeller: { type: Boolean, default: false },
    seenByAdmin: { type: Boolean, default: false },
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
    status: Joi.string(),
    message: Joi.string().max(255).allow(""),
    products: Joi.object(),
  }).validate(order);
