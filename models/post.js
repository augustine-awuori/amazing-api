const Joi = require("joi");
const mongoose = require("mongoose");

const { schema: commentSchema } = require("./comment");
const { schema: quotedRepostSchema } = require("./quotedRepost");

const schema = new mongoose.Schema({
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
  embeddedPostId: {
    ref: "Post",
    type: mongoose.Types.ObjectId,
  },
  message: {
    maxlength: 255,
    trim: true,
    type: String,
  },
  images: [Object],
  timestamp: {
    type: Number,
    default: function () {
      return this._id.getTimestamp();
    },
  },
  likes: [Object],
  likesAuthorsId: Object,
  comments: [commentSchema],
  quotedReposts: [quotedRepostSchema],
  reposts: [],
});

const Post = mongoose.model("Post", schema);

const validatePost = (post) => Joi.object({}).validate(post);

module.exports.Post = Post;
module.exports.validate = validatePost;
module.exports.postSchema = schema;
