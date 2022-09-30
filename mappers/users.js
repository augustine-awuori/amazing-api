const { Post } = require("../models/post");
const { mapImage } = require("./images");
const { mapPostImages } = require("./posts");

const mapAvatar = (avatar) => {
  if (!avatar) return;

  return mapImage(avatar);
};

const getPost = async (postId) => await Post.findById(postId);

const getPosts = (postsId) =>
  postsId.map(async (postId) => await getPost(postId));

const mapPosts = (postsId) =>
  getPosts(postsId).map(async (post) => {
    post.author.avatar = mapAvatar(post.author?.avatar);
    if (post.images) post.images = post.images.map(mapImage);
    if (post.image) post.image = mapImage(post.image);
    if (post.embeddedPostId)
      post.embeddedPost = mapPostImages(await getPost(post.embeddedPostId));

    return post;
  });

const mapUser = (user) => {
  delete user.password;
  user.avatar = mapAvatar(user?.avatar);

  user.followers = user.followers.map((follower) => {
    follower.avatar = mapAvatar(follower?.avatar);
    return follower;
  });

  user.following = user.following.map((follower) => {
    follower.avatar = mapAvatar(follower?.avatar);
    return follower;
  });

  user.posts = mapPosts(getPosts(user.posts));
  user.reposts = mapPosts(getPosts(user.reposts));
  user.quotedReposts = mapPosts(user.quotedReposts);
  user.listings = user.listings.map((listing) => {
    listing.images = listing.images.map(mapImage);
    return listing;
  });

  return user;
};

module.exports = { mapUser };
