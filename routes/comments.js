const express = require("express");
const router = express.Router();

const { Comment } = require("../models/comment");
const { Post } = require("../models/post");
const auth = require("../middleware/auth");
const service = require("../services/comments");
const validateUser = require("../middleware/validateUser");
const validateItemId = require("../middleware/validateItemId");

router.post(
  "/:id",
  [auth, validateUser, validateItemId(Post.findById)],
  async (req, res) => {
    const comment = await service.create(req.params.id, req.body.text);

    res.status(201).send(comment);
  }
);

router.get("/:id", async (req, res) => {
  const comments = await service.getPostComments(req.params.id);

  res.send(comments);
});

router.patch(
  "/:id",
  [auth, validateItemId(Comment.findById)],
  async (req, res) => {
    const comment = await service.update(req.params.id, req.body.text);

    if (!comment)
      return res.status(400).send({ error: "This comment doesn't exist" });

    res.send(comment);
  }
);

router.delete("/:id", async (req, res) => {
  const comment = await service.delete(req.params.id);

  res.send(comment);
});

module.exports = router;
