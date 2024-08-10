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
    location: {
      maxlength: 255,
      minlength: 3,
      trim: true,
      type: String,
    },
    types: Object,
    isVerified: { default: false, type: Boolean },
    views: { type: Number, default: 0 },
    feedToken: String,
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
    image: Joi.string().required(),
    location: Joi.string().min(3).max(255),
    types: Joi.object(),
  }).validate(shop);

module.exports.validateShop = validate;
module.exports.Shop = Shop;
