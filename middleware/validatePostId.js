const { Post } = require("../models/post");

module.exports = async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) return res.status(400).send({ error: "Post doesn't exist." });
  req.post = post;

  next();
};
