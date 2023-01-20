const Joi = require("joi");
const mongoose = require("mongoose");

const Event = mongoose.model(
  "Event",
  new mongoose.Schema({
    about: {
      maxlength: 255,
      trim: true,
      type: String,
    },
    author: {
      required: true,
      type: new mongoose.Schema({
        _id: {
          ref: "User",
          required: true,
          type: mongoose.Types.ObjectId,
        },
        avatar: Object,
        name: {
          maxlength: 50,
          minlength: 3,
          required: true,
          trim: true,
          type: String,
        },
        username: {
          maxlength: 50,
          minlength: 4,
          required: true,
          trim: true,
          type: String,
        },
      }),
    },
    date: {
      max: 31,
      min: 1,
      required: true,
      type: Number,
    },
    endTime: {
      type: String,
      minlength: 4,
      maxlength: 10,
      required: true,
    },
    images: [Object],
    location: {
      maxlength: 25,
      minlength: 4,
      required: true,
      type: String,
    },
    month: {
      maxlength: 9,
      minlength: 3,
      required: true,
      type: String,
    },
    startTime: {
      maxlength: 10,
      minlength: 4,
      required: true,
      type: String,
    },
    title: {
      maxlength: 100,
      minlength: 4,
      required: true,
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

const validate = (event) =>
  Joi.object({
    about: Joi.string().min(0).max(255),
    date: Joi.number().min(1).max(31).required(),
    endTime: Joi.string().min(4).max(10).required(),
    month: Joi.string().min(3).max(9).required(),
    startTime: Joi.string().min(4).max(10).required(),
    location: Joi.string().min(4).max(25).required(),
    title: Joi.string().min(4).max(100).required(),
  }).validate(event);

module.exports.Event = Event;
module.exports.validate = validate;
