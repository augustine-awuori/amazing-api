const Joi = require("joi");
const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  read: {
    type: Boolean,
    default: false,
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Notification = mongoose.model("Notification", schema);

const validate = (notification) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    from: Joi.string(),
    read: Joi.boolean().required(),
    to: Joi.string().required(),
  });

  return schema.validate(notification);
};

module.exports.schema = schema;
module.exports.Notification = Notification;
module.exports.validate = validate;
