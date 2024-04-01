const _ = require("lodash");
const { isValidObjectId } = require("mongoose");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

const { checkPhoneNumber } = require("../utility/whatsapp");
const { User, validate } = require("../models/user");
const auth = require("../middleware/auth");
const validateUser = require("../middleware/validateUser");
const validator = require("../middleware/validate");
const service = require("../services/users");

router.post("/", validator(validate), async (req, res) => {
  const { password, name, whatsapp } = req.body;
  let username = name.trim().toLowerCase().replace(/\s+/g, "");
  let user = await service.findOne({ username });

  let counter = 1;
  while (user) {
    username = `${username}${counter}`;
    user = await service.findOne({ username });
    counter++;
  }

  user = new User({ name, username, password });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  user.otherAccounts = { whatsapp: checkPhoneNumber(whatsapp) };

  await user.save();

  res
    .header("x-auth-token", user.generateAuthToken())
    .header("access-control-expose-headers", "x-auth-token")
    .send(
      _.pick(user, [
        "avatar",
        "aboutMe",
        "chatIds",
        "username",
        "name",
        "isAdmin",
        "isVerified",
        "otherAccounts",
      ])
    );
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

  res.send(_.omit(user, ["password"]));
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

  user
    ? res.send({ token: user.generateAuthToken(), user })
    : res.status(500).send({ error: "User update failed! Try again later" });
});

module.exports = router;
