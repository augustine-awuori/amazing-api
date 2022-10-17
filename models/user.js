const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const { messageSchema } = require("./message");
const { mapAvatar } = require("../mappers/listings");

const schema = new mongoose.Schema({
  aboutMe: {
    type: String,
    trim: true,
    minlength: 1,
    maxlength: 50,
  },
  avatar: Object,
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
  followers: {
    type: [
      new mongoose.Schema({
        aboutMe: {
          type: String,
          minlength: 3,
          maxlength: 50,
          trim: true,
        },
        avatar: Object,
        username: {
          type: String,
          trim: true,
          minlength: 3,
          maxlength: 50,
          required: true,
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
  following: {
    type: [
      new mongoose.Schema({
        aboutMe: {
          type: String,
          minlength: 1,
          maxlength: 50,
          trim: true,
        },
        avatar: Object,
        username: {
          type: String,
          trim: true,
          minlength: 3,
          maxlength: 50,
          required: true,
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
  messages: [messageSchema],
  isAdmin: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
});

schema.methods.generateAuthToken = function () {
  const mappedAvatar = this.avatar ? mapAvatar(this.avatar) : this.avatar;

  return jwt.sign(
    {
      _id: this._id,
      isAdmin: this.isAdmin,
      isVerified: this.isVerified,
      name: this.name,
      username: this.username,
      avatar: mappedAvatar,
    },
    process.env.JWT_PRIVATE_KEY
  );
};

const User = mongoose.model("User", schema);

const validateUser = (user) =>
  Joi.object({
    name: Joi.string().min(3).max(50).required(),
    password: Joi.string().min(6).max(1024).required(),
    username: Joi.string().min(3).max(50).required(),
  }).validate(user);

module.exports.User = User;
module.exports.validate = validateUser;
