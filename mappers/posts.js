const { mapAuthorImages } = require("../utility/imageManager");

const mapPost = (post) => {
  if (!post) return post;

  post.author = mapAuthorImages(post.author);

  return post;
};

const mapPosts = (posts) => posts.map(mapPost);

module.exports = { mapPost, mapPosts };
