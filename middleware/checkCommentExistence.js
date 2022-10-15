const { Comment } = require("../models/comment");

module.exports = async (req, res, next) => {
  const comment = await Comment.findById(req.params.id || req.body.commentId);

  if (!comment)
    return res.status(400).send("The comment  doesn't exist in the database.");
  req.comment = comment;

  next();
};
