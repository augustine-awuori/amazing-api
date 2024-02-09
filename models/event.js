const Joi = require("joi");
const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  author: { type: mongoose.Types.ObjectId, ref: "User" },
  image: String,
  turnOut: [Object],
  bookmarks: Object,
  location: {
    minlength: 3,
    type: String,
    required: true,
    trim: true,
    maxlength: 255,
  },
  fee: {
    min: 0,
    type: Number,
    max: 10_000,
    default: function () {
      return 0;
    },
  },
  title: {
    minlength: 3,
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
  },
  description: {
    minlength: 5,
    type: String,
    required: true,
    trim: true,
    maxlength: 255,
  },
  timestamp: {
    type: Number,
    default: function () {
      return this._id.getTimestamp();
    },
  },
});

const Event = mongoose.Model("Event", schema);

const validate = (event) =>
  Joi.object({
    author: Joi.string().required(),
    description: Joi.string().required().max(255).min(5),
    title: Joi.string().required().max(50).min(3),
    location: Joi.string().required().max(255).min(3),
    image: Joi.string().required(),
  }).validate(event);

module.exports.Event = Event;
module.exports.validate = validate;
