const { isValidObjectId } = require("mongoose");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const _ = require("lodash");

const { User, validate } = require("../models/user");
const auth = require("../middleware/auth");
const validateUser = require("../middleware/validateUser");
const validator = require("../middleware/validate");
const service = require("../services/users");

router.post("/", validator(validate), async (req, res) => {
  const { avatar, email, name, password } = req.body;
  let user = await service.findOne({ email });

  if (user) return res.status(400).send({ error: "Email is already taken" });

  user = new User({ avatar, name, email });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  user.feedToken = service.getUserFeedToken(user._id);
  user.chatToken = service.getUserChatToken(user._id);
  await user.save();

  res
    .header("x-auth-token", user.generateAuthToken())
    .header("access-control-expose-headers", "x-auth-token")
    .send(_.omit(user, ["password"]));
});

router.post("/quick", validator(validate), async (req, res) => {
  const { avatar, email, name } = req.body;

  let user = await service.findOne({ email });

  if (!user) {
    user = new User({ avatar, name, email });
    await user.save();
  }

  res
    .header("x-auth-token", user.generateAuthToken())
    .header("access-control-expose-headers", "x-auth-token")
    .send(_.omit(user, ["password"]));
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

router.patch("/chatIds", [auth, validateUser], async (req, res) => {
  const { email, chatId } = req.body;

  let user = await service.findById(req.user._id);
  if (!user)
    return res.status(400).send({ error: "You don't exist in the database" });

  if (!user.chatIds) {
    user.chatIds = { [email]: chatId };
    await user.save();

    return res.send(user);
  }

  user = await service.findByIdAndUpdate(
    user._id,
    { $set: { [`chatIds.${email}`]: chatId } },
    { new: true }
  );

  res.send(user);
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
