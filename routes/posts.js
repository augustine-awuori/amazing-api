const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const { mapPost } = require("../mappers/posts");
const { validatePost, Post } = require("../models/post");
const auth = require("../middleware/auth");
const populateReqPost = require("../middleware/populateReqPost");
const service = require("../services/posts");
const userService = require("../services/users");
const validatePostAuthor = require("../middleware/validatePostAuthor");
const validatePostId = require("../middleware/validatePostId");
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
      : res.status(404).send({ error: "This post doesn't exist." });
  }

  const userPosts = (await service.getAll()).filter(
    ({ author }) => author._id.toString() === id.toString()
  );
  res.send(userPosts);
});

router.delete(
  "/:id",
  [auth, populateReqPost, validatePostAuthor],
  async (req, res) => {
    const deleted = await service.findByIdAndDelete(req.params.id);

    res.send(deleted);
  }
);

router.patch(
  "/:id",
  [
    auth,
    validateUser,
    validatePostId,
    validatePostAuthor,
    validator(validatePost),
  ],
  async (req, res) => {
    const post = await service.findByIdAndUpdate(
      req.params.id,
      { $set: { text: req.body.text, edited: true } },
      { new: true }
    );

    post
      ? res.send(post)
      : res.status(404).send({ error: "This post doesn't exist" });
  }
);

module.exports = router;
