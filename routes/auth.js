const Joi = require("joi");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { StreamChat } = require("stream-chat");

const { getAuthCode, findUniqueUsername } = require("../utility/funcs");
const { sendMail } = require("../services/mailing");
const { User } = require("../models/user");
const service = require("../services/users");
const validator = require("../middleware/validate");

const serverClient = StreamChat.getInstance(
  process.env.chatApiKey,
  process.env.chatApiSecret
);

const validateDetails = (details) =>
  Joi.object({
    authCode: Joi.number().min(4).required(),
    email: Joi.string().email().required(),
  }).validate(details);

router.post("/", validator(validateDetails), async (req, res) => {
  const { email, authCode } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).send({ error: "Email isn't registered." });
  const isValidAuthCode = await bcrypt.compare(authCode.toString(), user.authCode);

  if (!isValidAuthCode)
    return res
      .status(400)
      .send({ error: "Invalid username and/or auth code." });

  user.authCode = "";
  await user.save();
  res.send(user.generateAuthToken());
});

router.post("/code", async (req, res) => {
  const { email } = req.body;

  let user = await User.findOne({ email });
  const authCode = getAuthCode();
  const salt = await bcrypt.genSalt(10);
  const hashedAuthCode = await bcrypt.hash(authCode.toString(), salt);

  if (!user) {
    const name = "Unknown";
    const username = await findUniqueUsername(name);
    user = new User({ email, name, username, invalid: true });
    const token = serverClient.createToken(user._id.toString());
    user.feedToken = token;
    user.chatToken = token;
  }
  user.authCode = hashedAuthCode;
  await user.save();

  const { accepted } = await sendMail({
    message: `Your one time authentication code is: ${authCode}`,
    subject: "Amazing Auth Code",
    to: email,
  });

  accepted
    ? res.send({ message: "Code has been sent to the email provided" })
    : res
      .status(500)
      .send({ error: "Something failed while sending the auth code" });
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
