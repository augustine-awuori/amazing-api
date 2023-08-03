const Joi = require("joi");
const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  backgroundColor: {
    max: 10,
    min: 4,
    required: true,
    trim: true,
    type: String,
  },
  icon: {
    max: 50,
    min: 1,
    required: true,
    trim: true,
    type: String,
  },
  label: {
    max: 50,
    min: 3,
    required: true,
    trim: true,
    type: String,
    unique: true,
  },
});

const Category = mongoose.model("Category", schema);

const validate = (category) =>
  Joi.object({
    backgroundColor: Joi.string().min(4).max(10).required(),
    icon: Joi.string().min(1).max(50).required(),
    label: Joi.string().min(3).max(50).required(),
  }).validate(category);

exports.Category = Category;
exports.validate = validate;
exports.schema = schema;
