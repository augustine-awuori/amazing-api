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
  avatar: {
    type: String,
    default: 'https://picsum.photos/1200/300'
  },
  chatToken: String,
  feedToken: String,
  coverPhoto: String,
  email: {
    type: String,
    unique: true,
  },
  username: String,
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
  password: {
    type: String,
    minlength: 6,
    maxlength: 1024,
    trim: true,
  },
  otherAccounts: Object,
  pushToken: String,
  timestamp: {
    type: Number,
    default: function () {
      return this._id.getTimestamp();
    },
  },
});

schema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      avatar: this.avatar,
      chatToken: this.chatToken,
      feedToken: this.feedToken,
      pushToken: this.pushToken,
      email: this.email,
      name: this.name,
    },
    process.env.jwtPrivateKey
  );
};

const User = mongoose.model("User", schema);

const validateUser = (user) =>
  Joi.object({
    avatar: Joi.string(),
    email: Joi.string().min(3).max(100).required(),
    name: Joi.string().min(3).max(50).required(),
    password: Joi.string(),
  }).validate(user);

exports.User = User;
exports.validate = validateUser;
exports.schema = schema;
