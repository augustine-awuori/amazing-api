const mongoose = require("mongoose");

const schema = new mongoose.Schema({
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
  likes: [Object],
});

const Reply = mongoose.model("Reply", schema);

module.exports.Reply = Reply;
module.exports.schema = schema;
