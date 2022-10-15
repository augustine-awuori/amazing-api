const mongoose = require("mongoose");

const Comment = mongoose.model(
  "Comment",
  new mongoose.Schema({
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
    image: Object,
    likes: [Object],
    likesAuthorsId: Object,
    message: {
      type: String,
      maxlength: 255,
      trim: true,
    },
    postId: {
      required: true,
      type: mongoose.Types.ObjectId,
    },
    quotedReposts: [],
    quotedRepostsAuthorsId: Object,
    repliesCount: { default: 0, type: Number },
    reposts: [],
    repostsAuthorsId: Object,
    timestamp: {
      type: Number,
      default: function () {
        return this._id.getTimestamp();
      },
    },
  })
);

module.exports.Comment = Comment;
