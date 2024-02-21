const Joi = require("joi");
const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  author: { type: mongoose.Types.ObjectId, ref: "User" },
  speech: {
    maxlength: 255,
    trim: true,
    type: String,
  },
  image: String,
  phone: {
    maxlength: 13,
    minlength: 10,
    trim: true,
    type: String,
  },
  position: {
    maxlength: 60,
    minlength: 10,
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

const Poster = mongoose.model("Poster", schema);

const validate = (poster) =>
  Joi.object({
    speech: Joi.string().max(255).allow(""),
    phone: Joi.string().min(10).max(13).allow(""),
    position: Joi.string().min(10).max(60).allow(""),
    image: Joi.string().required(),
  }).validate(poster);

module.exports.schema = schema;
module.exports.Poster = Poster;
module.exports.validate = validate;
