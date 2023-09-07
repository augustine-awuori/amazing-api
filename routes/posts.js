const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const { mapPost } = require("../mappers/posts");
const { validatePost, Post } = require("../models/post");
const auth = require("../middleware/auth");
const service = require("../services/posts");
const userService = require("../services/users");
const validateCategoryId = require("../middleware/validateCategoryId");
const validateItemAuthor = require("../middleware/validateItemAuthor");
const validateItemId = require("../middleware/validateItemId");
const validateUser = require("../middleware/validateUser");
const validator = require("../middleware/validate");

router.post(
  "/",
  [auth, validateUser, validator(validatePost)],
  async (req, res) => {
    const post = new Post({ author: req.user._id, text: req.body.text });

    await post.save();

    res.send(mapPost(post));
  }
);

router.get("/", async (_req, res) => {
  const posts = await service.getAll();

  res.send(posts);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  if (!mongoose.isValidObjectId(id))
    return res.status(400).send({ error: "Invalid ID." });

  const user = await userService.findById(id);
  if (!user) {
    const post = await service.findById(id);

    return post
      ? res.send(post)
      : res.status(404).send({ error: "This post  doesn't exist." });
  }

  const userPosts = (await service.getAll()).filter(
    ({ author }) => author._id.toString() === id.toString()
  );
  res.send(userPosts);
});

router.delete("/:id", auth, async (req, res) => {
  const post = await service.findById(req.params.id);

  if (req.user.username !== post?.author?.username)
    return res
      .status(403)
      .send({ error: "Unauthorised! You're not the author" });

  res.send(await service.findByIdAndDelete(req.params.id));
});

router.patch(
  "/:id",
  [
    auth,
    validateUser,
    validateItemId(Post.findById),
    validateItemAuthor,
    validateCategoryId,
  ],
  async (req, res) => {
    const { _id, text } = req.body;

    const post = await service.findByIdAndUpdate(
      _id,
      { $set: { text, edited: true } },
      { new: true }
    );

    post
      ? res.send(post)
      : res.status(404).send({ error: "This post doesn't exist" });
  }
);

module.exports = router;
