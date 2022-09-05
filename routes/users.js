const _ = require("lodash");
const bcrypt = require("bcrypt");
const multer = require("multer");
const express = require("express");
const router = express.Router();

const validator = require("../middleware/validate");
const { User, validate } = require("../models/user");
const avatarResize = require("../middleware/imageResize");

const upload = multer({ dest: "uploads/" });

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

    await user.save();

    res
      .header("x-auth-token", user.generateAuthToken())
      .header("access-control-expose-headers", "x-auth-token")
      .send(_.pick(user, ["_id", "name", "username", "isAdmin", "isVerified"]));
  }
);

module.exports = router;
