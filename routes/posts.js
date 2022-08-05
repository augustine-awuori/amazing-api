const express = require("express");
const router = express.Router();
const multer = require("multer");
const _ = require("lodash");

const { imageMapper } = require("../mappers/listings");
const { Post } = require("../models/post");
const { User } = require("../models/user");
const auth = require("../middleware/auth");
const imageResize = require("../middleware/imageResize");
const validateUser = require("../middleware/validateUser");
const validatePost = require("../middleware/validatePost");

const upload = multer({
  dest: "uploads",
  limits: { fieldSize: 25 * 1024 * 1024 },
});

router.post(
  "/",
  [auth, upload.array("images"), validateUser, imageResize, validatePost],
  async (req, res) => {
    let post = new Post({
      author: _.pick(await User.findById(req.user._id), [
        "_id",
        "avatar",
        "name",
        "username",
      ]),
      message: req.body.message,
    });
    post.images = req.images.map((fileName) => ({ fileName }));

    await post.save();

    res.send(imageMapper(post));
  }
);

module.exports = router;
