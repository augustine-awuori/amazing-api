const Joi = require("joi");
const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  author: {
    // avatar: Object,
    required: true,
    type: new mongoose.Schema({
      _id: {
        ref: "User",
        required: true,
        type: mongoose.Types.ObjectId,
      },
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
  categoryId: {
    ref: "Category",
    required: true,
    type: mongoose.Types.ObjectId,
  },
  description: {
    maxlength: 50,
    trim: true,
    type: String,
  },
  images: [Object],
  price: {
    max: 10_000,
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
});

const Listing = mongoose.model("Listing", schema);

const validate = (listing) =>
  Joi.object({
    categoryId: Joi.string().required(),
    description: Joi.string().max(50).allow(""),
    images: Joi.array().max(3),
    price: Joi.number().required().min(1).max(10_000),
    title: Joi.string().required().min(2).max(50),
  }).validate(listing);

module.exports.listingSchema = schema;
module.exports.Listing = Listing;
module.exports.validateListing = validate;
