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
  images: [String],
  type: { type: mongoose.Types.ObjectId, ref: "Type" },
  price: { max: 1_000_000, min: 1, required: true, type: Number },
  name: {
    maxlength: 50,
    minlength: 2,
    required: true,
    trim: true,
    type: String,
  },
  isNegotiable: {
    type: Boolean,
    default: false
  },
  views: [{ type: mongoose.Types.ObjectId, ref: "View" }],
  activityId: String,
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
    activityId: Joi.string().optional(),
    description: Joi.string().max(200).allow(""),
    shop: Joi.string(),
    images: Joi.array().min(1).max(7),
    price: Joi.number().required().min(1).max(1_000_000),
    type: Joi.string(),
    name: Joi.string().required().min(2).max(50),
    isNegotiable: Joi.boolean()
  }).validate(product);

module.exports.schema = schema;
module.exports.Product = Product;
module.exports.validate = validate;
