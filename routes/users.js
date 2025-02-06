const { isValidObjectId } = require("mongoose");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const _ = require("lodash");

const { findUniqueUsername } = require("../utility/funcs");
const { sendMail } = require("../services/mailing");
const { User, validate } = require("../models/user");
const auth = require("../middleware/auth");
const service = require("../services/users");
const validator = require("../middleware/validate");

async function sendMailForSignUp(user) {
  await sendMail({
    subject: "Welcome to Amazing eCommerce – Let's Get Started!",
    name: user.name,
    intro:
      "Welcome to Amazing. Thank you for signing up for Amazing eCommerce! We're thrilled to have you on board. Whether you're ready to showcase your products or explore what other students are selling, you've now got the perfect platform to manage your business while attending classes, anytime, anywhere.",
    to: user.email,
  });
}

router.post("/", validate(validate), async (req, res) => {
  const { email, name, authCode } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res.status(400).send({ error: "Auth code isn't generated" });

  const isValidAuthCode = await bcrypt.compare(
    authCode.toString(),
    user.authCode
  );
  if (!isValidAuthCode)
    return res
      .status(400)
      .send({ error: "Invalid username and/or auth code." });

  if (user.invalid) {
    user.name = name;
    user.username = await findUniqueUsername(name);
    user.invalid = false;
    user.authCode = "";
    await user.save();
  } else {
    user.authCode = "";
    await user.save();
  }

  const authToken = user.generateAuthToken();
  res
    .status(201)
    .header("x-auth-token", authToken)
    .header("access-control-expose-headers", "x-auth-token")
    .send(authToken);
});

router.post("/quick", validator(validate), async (req, res) => {
  const { avatar, email, name } = req.body;

  let user = await service.findOne({ email });

  if (!user) {
    user = new User({ avatar, name, email });
    await user.save();
    await sendMailForSignUp(user);
  }

  res
    .header("x-auth-token", user.generateAuthToken())
    .header("access-control-expose-headers", "x-auth-token")
    .send(_.omit(user, ["password"]));
});

router.get("/admin", async (_req, res) => {
  const admins = await service.getAll({ isAdmin: true });

  res.send(admins);
});

router.get("/", async (_req, res) => {
  const users = await service.getAll();

  res.send(users);
});

router.get("/:id", async (req, res) => {
  const userId = req.params.id;
  if (!isValidObjectId(userId))
    return res.status(400).send({ error: "Invalid ID." });

  const user = await service.findById(userId);
  if (!user)
    return res
      .status(404)
      .send({ error: "The user with the given ID does not exist." });

  res.send(user);
});

router.patch("/cart", auth, async (req, res) => {
  const user = await service.findById(req.user._id);

  if (!user) return res.status(404).send({ error: "User does not exist" });

  const { productId } = req.body;
  if (!productId) return res.status(400).send({ error: "Invalid product id" });

  let cart = user.cart || {};
  cart[productId] ? delete cart[productId] : (cart[productId] = productId);

  res.send(await service.findByIdAndUpdate(user._id, { cart }, { new: true }));
});

router.patch("/", [auth, validateUser], async (req, res) => {
  const user = await service.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
  });

  res
    .header("x-auth-token", user.generateAuthToken())
    .header("access-control-expose-headers", "x-auth-token")
    .send(user);
});

module.exports = router;
