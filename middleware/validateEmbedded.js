const { Comment } = require("../models/comment");
const { Post } = require("../models/post");

module.exports = async (req, res, next) => {
  const { embeddedPostId, embeddedCommentId } = req.body;

  if (embeddedPostId) {
    const post = await Post.findById(embeddedPostId);

    if (!post)
      return res.status(404).send("The post doesn't exist in the database");

    req.embeddedPost = post;
  }

  if (embeddedCommentId) {
    const comment = await Comment.findById(embeddedCommentId);

    if (!comment)
      return res.status(404).send("The comment doesn't exist in the database.");

    req.embeddedComment = comment;
  }

  next();
};
