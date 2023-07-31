const _ = require("lodash");
const bcrypt = require("bcrypt");
const multer = require("multer");
const express = require("express");
const router = express.Router();
const { isValidObjectId } = require("mongoose");

const { mapUser, mapUsers } = require("../mappers/users");
const { User, validate } = require("../models/user");
const auth = require("../middleware/auth");
const avatarResize = require("../middleware/imageResize");
const imagesResize = require("../middleware/imagesResize");
const validateUser = require("../middleware/validateUser");
const validator = require("../middleware/validate");

const upload = multer({ dest: "uploads/" });

const IMAGES_COUNT = 2;

router.post(
  "/",
  [upload.single("avatar"), avatarResize, validator(validate)],
  async (req, res) => {
    let user = await User.findOne({ username: req.body.username });
    if (user)
      return res.status(400).send("A user with the username already exist.");

    user = new User(_.pick(req.body, ["name", "username", "password"]));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    if (req.image) user.avatar = req.image;
    user.otherAccounts = { whatsapp: req.body.whatsapp };

    await user.save();

    res
      .header("x-auth-token", user.generateAuthToken())
      .header("access-control-expose-headers", "x-auth-token")
      .send(_.pick(user, ["_id", "name", "username", "isAdmin", "isVerified"]));
  }
);

router.get("/", async (req, res) => {
  const users = await User.find({});

  res.send(mapUsers(users));
});

router.get("/:id", async (req, res) => {
  const userId = req.params.id;
  if (!isValidObjectId(userId)) return res.status(400).send({ error: "Invalid ID." });

  const user = await User.findById(userId);
  if (!user)
    return res
      .status(404)
      .send({ error: "The user with the given ID does not exist." });

  res.send(mapUser(user));
});

router.patch(
  "/",
  [auth, validateUser, upload.array("images", IMAGES_COUNT), imagesResize],
  async (req, res) => {
    console.log(req.files);
    const { aboutMe, name, instagram, twitter, whatsapp, username } = req.body;
    const user = await User.findById(req.user._id);

    if (aboutMe) user.aboutMe = aboutMe;
    if (user.username !== username) {
      const userByUsername = await User.findOne({ username });
      if (userByUsername)
        return res
          .status(400)
          .send({ error: "The username is already taken." });
    }
    user.name = name;
    user.username = username;
    user.otherAccounts = { whatsapp, instagram, twitter };

    await user.save();

    res.send({ token: user.generateAuthToken(), user: mapUser(user) });
  }
);

module.exports = router;
