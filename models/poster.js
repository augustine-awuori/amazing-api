const Joi = require("joi");
const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  author: { type: mongoose.Types.ObjectId, ref: "User" },
  image: String,
  timestamp: {
    type: Number,
    default: function () {
      return this._id.getTimestamp();
    },
  },
});

const Poster = mongoose.model("Poster", schema);

const validate = (poster) =>
  Joi.object({
    image: Joi.string().required(),
  }).validate(poster);

module.exports.schema = schema;
module.exports.Poster = Poster;
module.exports.validate = validate;
