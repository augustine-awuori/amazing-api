const mongoose = require("mongoose");
const Joi = require("joi");

const Request = mongoose.model(
  "Request",
  new mongoose.Schema({
    author: { type: mongoose.Types.ObjectId, ref: "User" },
    category: { type: mongoose.Types.ObjectId, ref: "Category" },
    description: {
      maxlength: 255,
      trim: true,
      type: String,
    },
    title: {
      maxlength: 50,
      minlength: 2,
      required: true,
      trim: true,
      type: String,
    },
    image: String,
    timestamp: {
      type: Number,
      default: function () {
        return this._id.getTimestamp();
      },
    },
  })
);

const validate = (request) =>
  Joi.object({
    author: Joi.string(),
    image: Joi.string().allow(""),
    category: Joi.string(),
    description: Joi.string().max(255).allow(""),
    title: Joi.string().required().min(2).max(50),
  }).validate(request);

module.exports.validateRequest = validate;
module.exports.Request = Request;
