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
  category: {
    required: true,
    type: new mongoose.Schema({
      _id: {
        ref: "Category",
        required: true,
        type: mongoose.Types.ObjectId,
      },
      label: {
        max: 50,
        min: 3,
        required: true,
        trim: true,
        type: String,
        unique: true,
      },
    }),
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
async function createIndex() {
  await Listing.collection.createIndex(
    { "category.label": 1, "author.username": 1 },
    { unique: true }
  );
}
createIndex();

const validate = (listing) =>
  Joi.object({
    author: Joi.object({
      _id: Joi.any(),
      name: Joi.string().min(3).max(50).required(),
      username: Joi.string().min(3).max(50).required(),
    }),
    category: Joi.object({
      _id: Joi.any(),
      label: Joi.string().min(3).max(50).required(),
    }),
    description: Joi.string().max(200).allow(""),
    images: Joi.array().max(3),
    price: Joi.number().required().min(1).max(10_000),
    title: Joi.string().required().min(2).max(50),
  }).validate(listing);

module.exports.listingSchema = schema;
module.exports.Listing = Listing;
module.exports.validateListing = validate;
