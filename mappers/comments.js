const { mapAuthorImages } = require("../utility/imageManager");

const mapComment = (comment) => {
  if (comment) comment.author = mapAuthorImages(comment.author);

  return comment;
};

const mapComments = (comments = []) => comments.map(mapComment);

module.exports = { mapComment, mapComments };
