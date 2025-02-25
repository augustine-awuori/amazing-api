const express = require("express");
const router = express.Router();
const Joi = require("joi");

const { User } = require("../models/user");
const auth = require("../middleware/auth");
const validateWith = require("../middleware/validate");

const validator = (body) =>
  Joi.object({
    token: Joi.string().required()
  }).validate(body);

router.post(
  "/",
  [auth, validateWith(validator)],
  async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(400).send({ error: "Invalid user." });

    user.expoPushToken = req.body.token;
    user.save();

    res.status(201).send();
  }
);

module.exports = router;
