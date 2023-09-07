const mongoose = require("mongoose");
const Joi = require("joi");

const Comment = mongoose.model(
  "Comment",
  new mongoose.Schema({
    author: { type: mongoose.Types.ObjectId, ref: "User" },
    postId: { type: mongoose.Types.ObjectId, ref: "Post" },
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

const validate = (Comment) =>
  Joi.object({
    author: Joi.string(),
    text: Joi.string().min(2).max(255),
  }).validate(Comment);

module.exports.validateComment = validate;
module.exports.Comment = Comment;
