const express = require("express");
const router = express.Router();
const multer = require("multer");
const _ = require("lodash");

const { imageMapper } = require("../mappers/images");
const { mapComment } = require("../mappers/comments");
const { mapPostImages, mapPostsImages } = require("../mappers/posts");
const { Post } = require("../models/post");
const { User } = require("../models/user");
const auth = require("../middleware/auth");
const imagesResize = require("../middleware/imagesResize");
const postExists = require("../middleware/checkPostExistence");
const validateEmbedded = require("../middleware/validateEmbedded");
const validatePost = require("../middleware/validatePost");
const validateUser = require("../middleware/validateUser");

const upload = multer({
  dest: "uploads",
  limits: { fieldSize: 25 * 1024 * 1024 },
});

router.post(
  "/",
  [
    auth,
    upload.array("images"),
    validateUser,
    imagesResize,
    validatePost,
    validateEmbedded,
  ],
  async (req, res) => {
    let user = req.user;
    delete user.aboutMe;
    const { embeddedCommentId, embeddedPostId, message } = req.body;
    let embeddedPost = req.embeddedPost;
    let embeddedComment = req.embeddedComment;

    let post = new Post({ author: user, message });
    if (req.images) post.images = req.images.map((fileName) => ({ fileName }));
    if (embeddedPostId) {
      post.embeddedPostId = embeddedPostId;
      embeddedPost.quotedReposts.unshift(post);

      await embeddedPost.save();
    }

    if (embeddedCommentId) {
      post.embeddedCommentId = embeddedCommentId;
      embeddedComment.quotedReposts.unshift(post);

      await embeddedComment.save();
    }

    await post.save();

    if (embeddedPost) {
      embeddedPost = imageMapper(embeddedPost);
      embeddedPost.quotedReposts = imageMapper(embeddedPost.quotedReposts);
      post.embeddedPost = embeddedPost;
    }

    if (embeddedComment) post.embeddedComment = mapComment(embeddedComment);

    res.send(imageMapper(post));
  }
);

router.get("/", async (req, res) => {
  const posts = await Post.find({}).sort("-_id");

  res.send(mapPostsImages(posts));
});

router.get("/my/:id", async (req, res) => {
  const user = await getUser(req.params.id);

  if (!user)
    return res.status(404).send("The user with the given ID does not exist.");

  const myPosts = (await Post.find({}).sort("-_id")).filter(
    (post) => post.author._id.toString() === user._id.toString()
  );

  res.send(mapPostsImages(myPosts));
});

router.get("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post)
    return res.status(404).send("The post with the given ID was not found.");

  res.send(mapPostImages(post));
});

router.patch("/:id", [auth, validateUser, postExists], async (req, res) => {
  const { isAboutLiking } = req.body;

  if (isAboutLiking) res.send(await handleLike(req));
  else res.send(await handleReposting(req));
});

async function handleReposting(req) {
  const author = getAuthorProperties(req.user);
  const post = req.post;

  const index = post.reposts.findIndex(
    (a) => a._id.toString() === author._id.toString()
  );
  if (exists(index)) post.reposts.splice(index, 1);
  else post.reposts.unshift(author);

  await post.save();

  return post.reposts[0];
}

async function handleLike(req) {
  const userId = req.user._id.valueOf();
  const post = req.post;
  const index = post.likes.findIndex((lover) => areIdsSame(lover, userId));

  if (exists(index)) post.likes.splice(index, 1);
  else post.likes.unshift(req.user);

  await post.save();

  return imageMapper(post);
}

function exists(index) {
  return index !== -1;
}

function getAuthorProperties(user) {
  return _.pick(user, ["_id", "avatar", "name", "username"]);
}

function areIdsSame(dbObj, localId) {
  return dbObj._id.valueOf() === localId;
}

async function getUser(id) {
  return await User.findById(id);
}

function areIdsSame(dbObj, localId) {
  return dbObj._id.valueOf() === localId;
}

module.exports = router;
