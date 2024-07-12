const Joi = require("joi");
const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  dataId: {
    type: String,
    required: true
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  read: {
    type: Boolean,
    default: false,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  verb: {
    type: String,
    required: true
  }
});

const Notification = mongoose.model("Notification", schema);

const validate = (notification) => {
  const schema = Joi.object({
    dataId: Joi.string().required(),
    verb: Joi.string().required(),
    buyer: Joi.string(),
    read: Joi.boolean().required(),
    seller: Joi.string().required(),
  });

  return schema.validate(notification);
};

module.exports.schema = schema;
module.exports.Notification = Notification;
module.exports.validate = validate;
