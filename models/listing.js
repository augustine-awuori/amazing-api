const Joi = require("joi");
const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  author: Object,
  authorId: mongoose.Types.ObjectId,
  category: Object,
  categoryId: mongoose.Types.ObjectId,
  description: {
    maxlength: 200,
    trim: true,
    type: String,
  },
  images: [Object],
  price: {
    max: 1_000_000,
    min: 1,
    required: true,
    type: Number,
  },
  title: {
    maxlength: 50,
    minlength: 2,
    required: true,
    trim: true,
    type: String,
  },
  timestamp: {
    type: Number,
    default: function () {
      return this._id.getTimestamp();
    },
  },
});

const Listing = mongoose.model("Listing", schema);

const validate = (listing) =>
  Joi.object({
    authorId: Joi.string(),
    categoryId: Joi.string(),
    description: Joi.string().max(200).allow(""),
    images: Joi.array().min(1).max(3),
    price: Joi.number().required().min(1).max(1_000_000),
    title: Joi.string().required().min(2).max(50),
  }).validate(listing);

module.exports.listingSchema = schema;
module.exports.Listing = Listing;
module.exports.validateListing = validate;
