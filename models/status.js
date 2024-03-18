const Joi = require("joi");
const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  color: {
    max: 10,
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

const Status = mongoose.model("Status", schema);

const validate = (status) =>
  Joi.object({
    color: Joi.string().min(4).max(10).required(),
    label: Joi.string().min(3).max(50).required(),
  }).validate(status);

exports.Status = Status;
exports.validate = validate;
exports.schema = schema;
