const { imageMapper, mapImage } = require("../mappers/images");

const mapAvatar = (avatar) => {
  if (!avatar) return;
  return mapImage(avatar);
};

const mapPostComment = (comment) => {
  const result = imageMapper(comment);
  result.replies = result.replies.map((reply) => {
    if (reply.author.avatar)
      reply.author.avatar = mapAvatar(reply.author.avatar);
    return reply;
  });
  if (result.image) result.image = mapImage(result.image);

  return result;
};

const mapPostsComments = (posts) =>
  posts.map((post) => {
    post.comments = post.comments.map(mapPostComment);
    return post;
  });

const mapPostImages = (post) => {
  if (post.author.avatar) post.author.avatar = mapAvatar(post.author.avatar);
  post.images = post.images.map(mapImage);
  if (post?.likes?.length)
    post.likes = post.likes.map((like) => mapAvatar(like.author.avatar));
  if (post?.comments?.length) post.comments = post.comments.map(mapPostComment);
  if (post?.comments?.likes?.length)
    post.comments.likes = post.comments.likes.map((like) =>
      mapAvatar(like.author.avatar)
    );

  return post;
};

const mapPostsImages = (posts) => posts.map(mapPostImages);

module.exports = { mapPostComment, mapPostsComments, mapPostsImages };
