const Joi = require("joi");
const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  author: { type: mongoose.Types.ObjectId, ref: "User" },
  speech: String,
  image: String,
  phone: String,
  position: String,
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
    speech: Joi.string().optional(""),
    phone: Joi.string().optional(),
    position: Joi.string().optional(),
    image: Joi.string().required(),
  }).validate(poster);

module.exports.schema = schema;
module.exports.Poster = Poster;
module.exports.validate = validate;
