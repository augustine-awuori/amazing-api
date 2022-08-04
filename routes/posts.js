const express = require("express");
const router = express.Router();
const multer = require("multer");

const { imageMapper } = require("../mappers/listings");
const { Post } = require("../models/post");
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
      author: {
        _id: req.user._id,
        name: req.user.name,
        username: req.user.username,
        avatar: req.user.avatar,
      },
      message: req.body.message,
    });
    post.images = req.images.map((fileName) => ({ fileName }));

    await post.save();

    res.send(imageMapper(post));
  }
);

module.exports = router;
