const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const schema = new mongoose.Schema({
  aboutMe: {
    type: String,
    trim: true,
    minlength: 3,
    maxlength: 255,
  },
  avatar: String,
  chatToken: String,
  coverPhoto: String,
  email: {
    type: String,
    unique: true,
  },
  username: {
    type: String,
    maxlength: 50,
    minlength: 4,
    trim: true,
  },
  name: {
    type: String,
    trim: true,
    minlength: 3,
    maxlength: 50,
    required: true,
  },
  isAdmin: { type: Boolean, default: false },
  isVerified: {
    type: Boolean,
    default: function () {
      return this.isAdmin;
    },
  },
  expoPushToken: String,
  otherAccounts: Object,
  pushTokens: Object,
  timestamp: {
    type: Number,
    default: function () {
      return this._id.getTimestamp();
    },
  },
});

schema.methods.generateAuthToken = function () {
  return jwt.sign(
    { _id: this._id, email: this.email },
    process.env.jwtPrivateKey
  );
};

const User = mongoose.model("User", schema);

const validateUser = (user) =>
  Joi.object({
    avatar: Joi.string(),
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(3).max(100).required(),
  }).validate(user);

exports.User = User;
exports.validate = validateUser;
exports.schema = schema;
