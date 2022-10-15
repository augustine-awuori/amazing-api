const { imageMapper, mapImage } = require("../mappers/images");

const mapAvatar = (avatar) => (avatar ? mapImage(avatar) : undefined);

const mapPostImages = (post) =>
  imageMapper(mapRepostsAvatars(mapQuotedReposts(post)));

const mapPostsImages = (posts) => posts.map(mapPostImages);

function mapQuotedReposts(post) {
  let authorsId = {};

  post.quotedReposts = post.quotedReposts.map((quote) => {
    const authorId = quote.author._id.toString();
    authorsId[authorId] = authorId;

    quote.author.avatar = mapAvatar(quote.author.avatar);
    quote.images = quote.images.map(mapImage);

    return quote;
  });
  post.quotedRepostsAuthorsId = authorsId;

  return post;
}

function mapRepostsAvatars(post) {
  let authorsId = {};

  post.reposts = post.reposts.map((author) => {
    author.avatar = mapAvatar(author.avatar);
    const authorId = author._id.toString();
    authorsId[authorId] = authorId;

    return author;
  });
  post.repostsAuthorsId = authorsId;

  return post;
}

module.exports = { mapPostImages, mapPostsImages };
