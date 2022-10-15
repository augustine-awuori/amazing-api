const { Post } = require("../models/post");

module.exports = async (req, res, next) => {
  const postId = req.params.id || req.body.postId;

  const post = await Post.findById(postId);
  if (!post)
    return res.status(400).send("The post with the given ID doesn't exist.");
  req.post = post;

  next();
};
