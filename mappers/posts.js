const { imageMapper, mapImage } = require("../mappers/images");

const mapAvatar = (avatar) => {
  if (!avatar) return;
  return mapImage(avatar);
};

const mapPostComment = (comment) => {
  const result = imageMapper(comment);
  result.replies = result.replies.map((reply) => {
    reply.author.avatar = mapAvatar(reply.author.avatar);
    return reply;
  });
  result.reposts = mapRepostsAvatars(result);
  if (result.image) result.image = mapImage(result.image);

  return result;
};

const mapPostImages = (post) => {
  post.comments = post.comments.map(mapPostComment);
  post.reposts = mapRepostsAvatars(post);
  post.quotedReposts = mapQuotedReposts(post);

  return imageMapper(post);
};

const mapPostsImages = (posts) => posts.map(mapPostImages);

function mapQuotedReposts(post) {
  return post.quotedReposts.map((quote) => {
    quote.author.avatar = mapAvatar(quote.author.avatar);
    quote.images = quote.images.map(mapImage);

    return quote;
  });
}

function mapRepostsAvatars(post) {
  return post.reposts.map((author) => {
    author.avatar = mapAvatar(author.avatar);
    return author;
  });
}

module.exports = { mapPostComment, mapPostImages, mapPostsImages };
