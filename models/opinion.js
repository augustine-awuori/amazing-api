const mongoose = require("mongoose");
const Joi = require("joi");

const Opinion = mongoose.model(
  "Opinion",
  new mongoose.Schema({
    text: {
      minlength: 2,
      maxlength: 255,
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

const validate = (opinion) =>
  Joi.object({
    text: Joi.string().min(1).max(255),
  }).validate(opinion);

module.exports.validateOpinion = validate;
module.exports.Opinion = Opinion;
