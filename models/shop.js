const mongoose = require("mongoose");
const Joi = require("joi");

const Shop = mongoose.model(
  "Shop",
  new mongoose.Schema({
    author: { type: mongoose.Types.ObjectId, ref: "User" },
    image: String,
    name: {
      type: String,
      maxlength: 50,
      minlength: 3,
      required: true,
      trim: true,
      unique: true,
    },
    type: { type: mongoose.Types.ObjectId, ref: "Type" },
    timestamp: {
      type: Number,
      default: function () {
        return this._id.getTimestamp();
      },
    },
  })
);

const validate = (shop) =>
  Joi.object({
    author: Joi.string(),
    name: Joi.string().min(3).max(50),
    type: Joi.string(),
  }).validate(shop);

module.exports.validateShop = validate;
module.exports.Shop = Shop;
