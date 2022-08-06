const express = require("express");
const router = express.Router();
const multer = require("multer");
const _ = require("lodash");

const { imageMapper } = require("../mappers/listings");
const { Post } = require("../models/post");
const auth = require("../middleware/auth");
const checkPostExistence = require("../middleware/checkPostExistence");
const imageResize = require("../middleware/imageResize");
const validatePost = require("../middleware/validatePost");
const validateUser = require("../middleware/validateUser");

const upload = multer({
  dest: "uploads",
  limits: { fieldSize: 25 * 1024 * 1024 },
});

router.post(
  "/",
  [auth, upload.array("images"), validateUser, imageResize, validatePost],
  async (req, res) => {
    delete req.user.aboutMe;
    let post = new Post({ author: req.user, message: req.body.message });
    post.images = req.images.map((fileName) => ({ fileName }));

    await post.save();

    res.send(imageMapper(post));
  }
);

router.patch(
  "/:id",
  [auth, validateUser, checkPostExistence],
  async (req, res) => {
    const { isAboutLike } = req.body;
    let post = req.post;

    if (isAboutLike) {
      const index = post.likes.findIndex(
        (lover) => lover._id.valueOf() === req.user._id.valueOf()
      );
      if (index >= 0) post.likes.splice(index, 1);
      else post.likes = [req.user, ...post.likes];
    }
    await post.save();

    res.send(imageMapper(post));
  }
);

router.get("/", async (req, res) => {
  const posts = await Post.find({}).sort("-_id");

  const resources = posts.map(imageMapper);

  res.send(resources);
});

module.exports = router;
