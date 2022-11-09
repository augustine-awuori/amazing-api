const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const { messageSchema } = require("./message");
const { mapImage } = require("../mappers/images");

const schema = new mongoose.Schema({
  aboutMe: {
    type: String,
    trim: true,
    minlength: 3,
    maxlength: 100,
  },
  avatar: Object,
  coverPhoto: Object,
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
  followings: {
    type: [
      new mongoose.Schema({
        aboutMe: {
          type: String,
          trim: true,
          minlength: 3,
          maxlength: 100,
        },
        avatar: Object,
        username: {
          type: String,
          maxlength: 50,
          minlength: 4,
          required: true,
          trim: true,
        },
        name: {
          type: String,
          trim: true,
          minlength: 3,
          maxlength: 50,
          required: true,
        },
      }),
    ],
  },
  followers: {
    type: [
      new mongoose.Schema({
        aboutMe: {
          type: String,
          trim: true,
          minlength: 3,
          maxlength: 100,
        },
        avatar: Object,
        username: {
          type: String,
          maxlength: 50,
          minlength: 4,
          required: true,
          trim: true,
        },
        name: {
          type: String,
          trim: true,
          minlength: 3,
          maxlength: 50,
          required: true,
        },
      }),
    ],
  },
  followingsId: Object,
  followersId: Object,
  messages: [messageSchema],
  isAdmin: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  otherAccounts: Object,
  timestamp: {
    type: Number,
    default: function () {
      return this._id.getTimestamp();
    },
  },
});

schema.methods.generateAuthToken = function () {
  const mappedAvatar = this.avatar ? mapImage(this.avatar) : this.avatar;

  return jwt.sign(
    {
      _id: this._id,
      avatar: mappedAvatar,
      isAdmin: this.isAdmin,
      isVerified: this.isVerified,
      name: this.name,
      username: this.username,
    },
    process.env.JWT_PRIVATE_KEY
  );
};

const User = mongoose.model("User", schema);

const validateUser = (user) =>
  Joi.object({
    aboutMe: Joi.string().min(3).max(100),
    avatar: Joi.object().optional(),
    coverPhoto: Joi.object().optional(),
    name: Joi.string().min(3).max(50).required(),
    password: Joi.string().min(6).max(1024).required(),
    username: Joi.string().min(3).max(50).required(),
  }).validate(user);

module.exports.User = User;
module.exports.validate = validateUser;
