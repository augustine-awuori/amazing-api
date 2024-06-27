const Joi = require("joi");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const { User } = require("../models/user");
const service = require("../services/users");
const validator = require("../middleware/validate");

router.post("/", validator(validate), async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).send({ error: "Email isn't registered." });
  console.log("user.password", user.password);
  if (user.password) {
    console.log("comparing passwords");
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log("isValidPassword", isValidPassword);
    if (!isValidPassword)
      return res
        .status(400)
        .send({ error: "Invalid username and/or password." });
  } else {
    console.log("processing and saving password");
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
  }

  console.log("preparing and sending token");
  const token = user.generateAuthToken();
  res.send(token);
});

// TODO: Protect this route ASAP
router.post("/token", async (req, res) => {
  const user = await service.findOne({ email: req.body.email });

  if (!user)
    return res.status(404).send({ error: "You don't exist on the database" });

  res.send(user.generateAuthToken());
});

function validate(req) {
  return Joi.object({
    password: Joi.string().min(5).max(1024).required(),
    email: Joi.string().min(3).max(50).required(),
  }).validate(req);
}

module.exports = router;
