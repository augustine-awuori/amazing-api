const mongoose = require("mongoose");

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
  images: [Object],
  message: {
    type: String,
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

const QuotedRepost = mongoose.model("QuotedRepost", schema);

module.exports.schema = schema;
module.exports.QuotedRepost = QuotedRepost;
