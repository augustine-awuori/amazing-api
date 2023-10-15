const Joi = require("joi");
const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  author: { type: mongoose.Types.ObjectId, ref: "User" },
  description: {
    maxlength: 200,
    trim: true,
    type: String,
  },
  shop: { type: mongoose.Types.ObjectId, ref: "Shop" },
  image: String,
  price: { max: 1_000_000, min: 1, required: true, type: Number },
  name: {
    maxlength: 50,
    minlength: 2,
    required: true,
    trim: true,
    type: String,
  },
  timestamp: {
    type: Number,
    default: function () {
      return this._id.getTimestamp();
    },
  },
});

const Product = mongoose.model("Product", schema);

const validate = (product) =>
  Joi.object({
    author: Joi.string(),
    description: Joi.string().max(200).allow(""),
    shop: Joi.string(),
    image: Joi.object(),
    price: Joi.number().required().min(1).max(1_000_000),
    name: Joi.string().required().min(2).max(50),
  }).validate(product);

module.exports.schema = schema;
module.exports.Product = Product;
module.exports.validate = validate;
