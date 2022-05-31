const validator = require("../middleware/validate");
const { User, validate } = require("../models/user");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

router.post("/", validator(validate), async (req, res) => {
    let user = await User.findOne({ username: req.body.username });
    if (user)
        return res.status(400).send("A user with the username already exist.");

    user = new User(req.body, _.pick(["name", "username", "password"]));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    res
        .header("x-auth-token", user.generateAuthToken())
        .send(_.pick(user, ["_id", "name", "username", "isAdmin", "isVerified"]));
});

module.exports = router;
