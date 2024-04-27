const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const pushSubscriptionSchema = new mongoose.Schema({
  endpoint: {
    type: String,
    required: true,
  },
  keys: {
    p256dh: {
      type: String,
      required: true,
    },
    auth: {
      type: String,
      required: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const schema = new mongoose.Schema({
  aboutMe: {
    type: String,
    trim: true,
    minlength: 3,
    maxlength: 255,
  },
  avatar: String,
  coverPhoto: String,
  chatIds: Object,
  username: {
    type: String,
    maxlength: 50,
    minlength: 4,
    required: true,
    trim: true,
    unique: true,
  },
  name: {
    type: String,
    trim: true,
    minlength: 3,
    maxlength: 50,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024,
    trim: true,
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
  pushSubscriptions: [pushSubscriptionSchema],
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
      isAdmin: this.isAdmin,
      isVerified: this.isVerified,
      name: this.name,
      username: this.username,
    },
    process.env.jwtPrivateKey
  );
};

const User = mongoose.model("User", schema);

const validateUser = (user) =>
  Joi.object({
    aboutMe: Joi.string().min(3).max(255),
    avatar: Joi.string(),
    coverPhoto: Joi.object().optional(),
    name: Joi.string().min(3).max(50).required(),
    password: Joi.string().min(6).max(1024).required(),
    whatsapp: Joi.string().min(12).max(13).required(),
  }).validate(user);

exports.User = User;
exports.validate = validateUser;
exports.schema = schema;
