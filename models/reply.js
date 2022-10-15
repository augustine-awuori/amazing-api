const mongoose = require("mongoose");

const Reply = mongoose.model(
  "Reply",
  new mongoose.Schema({
    author: {
      required: true,
      type: {
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
      },
    },
    commentId: {
      required: true,
      type: mongoose.Types.ObjectId,
    },
    message: {
      required: true,
      type: String,
      maxlength: 255,
      trim: true,
    },
    likes: [Object],
    likesAuthorsId: Object,
    timestamp: {
      type: Number,
      default: function () {
        return this._id.getTimestamp();
      },
    },
  })
);

module.exports.Reply = Reply;
