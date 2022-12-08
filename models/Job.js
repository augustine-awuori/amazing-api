const mongoose = require("mongoose");

const Job = mongoose.model(
  "Job",
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
    title: {
      maxlength: 30,
      minlength: 4,
      required: true,
      trim: true,
      type: String,
    },
    description: {
      maxlength: 255,
      minlength: 4,
      required: true,
      trim: true,
      type: String,
    },
    salary: {
      minlength: 1,
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

module.exports.Job = Job;
