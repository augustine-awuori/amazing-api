const express = require("express");
const router = express.Router();
const multer = require("multer");
const _ = require("lodash");

const { Comment } = require("../models/comment");
const { imageMapper, mapImage } = require("../mappers/images");
const {
  mapPostComment,
  mapPostImages,
  mapPostsImages,
} = require("../mappers/posts");
const { Post } = require("../models/post");
const { Reply } = require("../models/reply");
const { User } = require("../models/user");
const { QuotedRepost } = require("../models/quotedRepost");
const auth = require("../middleware/auth");
const checkPostExistence = require("../middleware/checkPostExistence");
const imageResize = require("../middleware/imageResize");
const imagesResize = require("../middleware/imagesResize");
const validatePost = require("../middleware/validatePost");
const validateUser = require("../middleware/validateUser");

const upload = multer({
  dest: "uploads",
  limits: { fieldSize: 25 * 1024 * 1024 },
});

router.post(
  "/",
  [auth, upload.array("images"), validateUser, imagesResize, validatePost],
  async (req, res) => {
    let user = req.user;
    delete user.aboutMe;
    const { embeddedPostId, message } = req.body;
    let embeddedPost;
    user = await getUser(req.user._id);

    let post = new Post({ author: req.user, message });
    post.images = req.images.map((fileName) => ({ fileName }));
    if (embeddedPostId) {
      post.embeddedPostId = embeddedPostId;
      const quotedRepost = new QuotedRepost({
        author: getAuthorFrom(req),
        images: post.images,
        message,
      });

      embeddedPost = await Post.findById(embeddedPostId);
      embeddedPost.quotedReposts.unshift(quotedRepost);
      await embeddedPost.save();

      user.quotedReposts.unshift(post._id);
    } else user.posts.unshift(post._id);

    user.save();
    await post.save();

    if (embeddedPost) {
      embeddedPost = imageMapper(embeddedPost);
      embeddedPost.quotedReposts = imageMapper(embeddedPost.quotedReposts);
      post.embeddedPost = embeddedPost;
    }

    res.send(imageMapper(post));
  }
);

router.get("/", async (req, res) => {
  const posts = await Post.find({}).sort("-_id");

  res.send(mapPostsImages(posts));
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;

  const post = await Post.findById(id);
  if (post) return res.send(mapPostImages(post));

  const user = await getUser(id);
  if (!user) return res.status(404).send("The given ID does not exist.");

  const posts = await Post.find({
    author: _.pick(user, ["_id", "name", "username", "avatar"]),
  }).sort("-_id");
  res.send(mapPostsImages(posts));
});

router.patch(
  "/:id",
  [
    upload.single("avatar"),
    imageResize,
    auth,
    validateUser,
    checkPostExistence,
  ],
  async (req, res) => {
    const {
      isAboutLiking,
      isAboutCommenting,
      isAboutReplying,
      isAboutReposting,
    } = req.body;
    let result;

    if (isAboutLiking === "true") result = await handleLike(req);
    else if (isAboutCommenting === "true") {
      if (isAboutReplying === "true") result = await handleReply(req);
      else result = await handleComment(req);
    } else if (isAboutReposting === "true") result = handleReposting(req);

    // TODO: Find out why response always send undefined
    res.send(result);
  }
);

async function handleReposting(req) {
  const author = getAuthorFrom(req);
  const post = req.post;
  const user = await User.findById(req.user._id);
  let comment;

  if (req.body.isAboutCommentReposting === "true") {
    const index = post.comments.findIndex((c) =>
      areIdsSame(c, req.body.commentId)
    );
    comment = post.comments[index];
    comment.reposts.unshift(author);
  } else post.reposts.unshift(author);
  user.reposts.unshift(post._id);

  await user.save();
  await post.save();

  return comment || post.reposts[0];
}

async function handleReply(req) {
  const reply = new Reply({
    author: getAuthorFrom(req),
    message: req.body.message,
  });
  const post = req.post;

  const index = post.comments.findIndex((c) =>
    areIdsSame(c, req.body.commentId)
  );
  if (index < 0) return;
  post.comments[index].replies.unshift(reply);
  if (reply.author.avatar) reply.author.avatar = mapImage(reply.author);
  await post.save();

  return reply;
}

async function handleComment(req) {
  let comment = new Comment({
    author: getAuthorFrom(req),
    message: req.body.message,
  });
  const post = req.post;
  if (req.image) comment.image = req.image;
  post.comments.unshift(comment);

  await post.save();

  return mapPostComment(comment);
}

async function handleLike(req) {
  const userId = req.user._id.valueOf();
  const post = req.post;

  const index = post.likes.findIndex((lover) => areIdsSame(lover, userId));
  if (isLiking(index)) {
    post.likes = [req.user, ...post.likes];
    if (!post.likesAuthorsId) post.likesAuthorsId = {};
    post.likesAuthorsId[userId] = userId;
  } else {
    post.likes.splice(index, 1);
    const loversId = { ...post.likesAuthorsId };
    delete loversId[userId];
    post.likesAuthorsId = loversId;
  }

  await post.save();

  return imageMapper(post);
}

function isLiking(index) {
  return index === -1;
}

function getAuthorFrom(req) {
  return _.pick(req.user, ["_id", "avatar", "name", "username"]);
}

function areIdsSame(dbObj, localId) {
  return dbObj._id.valueOf() === localId;
}

async function getUser(id) {
  return await User.findById(id);
}

module.exports = router;
