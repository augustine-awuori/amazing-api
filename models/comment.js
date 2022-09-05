const mongoose = require("mongoose");

const { schema: replySchema } = require("./reply");

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
  replies: [replySchema],
  message: {
    type: String,
    maxlength: 255,
    trim: true,
  },
  timestamp: {
    type: Number,
    default: function () {
      return this._id.getTimestamp();
    },
  },
  image: Object,
  likes: [Object],
});

const Comment = mongoose.model("Comment", schema);

module.exports.Comment = Comment;
module.exports.schema = schema;
