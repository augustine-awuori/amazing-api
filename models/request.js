const mongoose = require("mongoose");
const Joi = require("joi");

const Request = mongoose.model(
  "Request",
  new mongoose.Schema({
    author: Object,
    authorId: mongoose.Types.ObjectId,
    category: Object,
    categoryId: mongoose.Types.ObjectId,
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
    timestamp: {
      type: Number,
      default: function () {
        return this._id.getTimestamp();
      },
    },
  })
);

const validate = (listing) =>
  Joi.object({
    authorId: Joi.any,
    categoryId: Joi.any,
    description: Joi.string().max(255).allow(""),
    title: Joi.string().required().min(2).max(50),
  }).validate(listing);

module.exports.validateRequest = validate;
module.exports.Request = Request;
