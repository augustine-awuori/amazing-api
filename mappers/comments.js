const { imageMapper } = require("./images");

const mapComment = (comment) => imageMapper(comment);

const mapComments = (comments) => comments.map(mapComment);

module.exports = { mapComment, mapComments };
