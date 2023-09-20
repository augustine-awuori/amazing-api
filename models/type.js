const Joi = require("joi");
const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  label: {
    max: 50,
    min: 3,
    required: true,
    trim: true,
    type: String,
    unique: true,
  },
});

const Type = mongoose.model("Type", schema);

const validate = (type) =>
  Joi.object({
    label: Joi.string().min(3).max(50).required(),
  }).validate(type);

exports.Type = Type;
exports.validate = validate;
exports.schema = schema;
