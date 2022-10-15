const { imageMapper, mapImage } = require("./images");

const mapAvatar = (avatar) => (avatar ? mapImage(avatar) : undefined);

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

function mapQuotedRepostsAvatars(post) {
  let authorsId = {};

  post.quotedReposts = post.quotedReposts.map((author) => {
    author.avatar = mapAvatar(author.avatar);
    const authorId = author._id.toString();
    authorsId[authorId] = authorId;

    return author;
  });
  post.quotedRepostsAuthorsId = authorsId;

  return post;
}

const mapComment = (comment) =>
  mapQuotedRepostsAvatars(mapRepostsAvatars(imageMapper(comment)));

const mapComments = (comments) => comments.map(mapComment);

module.exports = { mapComment, mapComments };
