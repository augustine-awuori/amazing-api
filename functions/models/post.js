const mongoose = require("mongoose");
const Joi = require("joi");

const Post = mongoose.model(
  "Post",
  new mongoose.Schema({
    author: { type: mongoose.Types.ObjectId, ref: "User" },
    likersId: {},
    likers: [],
    text: {
      minlength: 2,
      maxlength: 255,
      required: true,
      trim: true,
      type: String,
    },
    edited: { type: Boolean, default: false },
    timestamp: {
      type: Number,
      default: function () {
        return this._id.getTimestamp();
      },
    },
  })
);

const validate = (post) =>
  Joi.object({ text: Joi.string().min(2).max(255) }).validate(post);

module.exports.validatePost = validate;
module.exports.Post = Post;
