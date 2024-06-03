const Joi = require("joi");
const express = require("express");
const router = express.Router();

const { User } = require("../models/user");
const service = require("../services/users");
const validator = require("../middleware/validate");

router.post("/", validator(validate), async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user)
    return res.status(404).send({ error: "Username isn't registered." });

  const token = user.generateAuthToken();
  res.send(token);
});

// TODO: Protect this route ASAP
router.get("/token", async (req, res) => {
  const user = await service.findOne({ email: req.body.email });

  if (!user)
    return res.status(404).send({ error: "You don't exist on the database" });

  res.send(user.generateAuthToken());
});

function validate(req) {
  return Joi.object({
    password: Joi.string().min(5).max(1024).required(),
    username: Joi.string().min(3).max(50).required(),
  }).validate(req);
}

module.exports = router;
