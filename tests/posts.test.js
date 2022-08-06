const request = require("supertest");
const { imageUnmapper } = require("../mappers/listings");

const { Post } = require("../models/post");
const { User } = require("../models/user");

const endpoint = "/api/posts";

describe(endpoint, () => {
  let app;
  let token;
  let message;
  let username = "@awuori";

  beforeEach(async () => {
    app = require("../index");

    const user = new User({
      name: "Augustine Awuori",
      username,
      password: "123456",
    });
    token = user.generateAuthToken();
    await user.save();

    message = "This is a simple message just to say hi in Spanish";
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  async function deleteImages() {
    const posts = await Post.find({});
    posts.forEach(imageUnmapper);
  }

  const createPost = () =>
    request(app)
      .post(endpoint)
      .field("message", message)
      .attach("images", "public/test/assets/file.jpg")
      .set("x-auth-token", token);

  describe("POST/", () => {
    afterEach(async () => {
      await User.deleteMany({});
      await Post.deleteMany({});
      await deleteImages();
    });

    const exec = createPost;

    it("should return 401 if the token is not provided", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 400 if the token is not valid", async () => {
      token = "invalid token";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if the user doesn't exist", async () => {
      token = new User().generateAuthToken();

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if neither images nor message is present", async () => {
      const res = await request(app).post(endpoint).set("x-auth-token", token);

      expect(res.status).toBe(400);
    });

    it("should map images to objects with `fileName` property", async () => {
      await exec();
      await deleteImages();

      const post = await Post.findOne({});

      expect(post.images.length).toBe(1);
      expect(post.images[0]).toHaveProperty("fileName");
    });

    it("should save the post if the post details are correct.", async () => {
      await exec();
      await deleteImages();

      const post = await Post.findOne({});

      expect(post.author.username).toBe(username);
      expect(post.message).toBe(message);
      expect(post.images.length).toBe(1);
    });

    it("should map the images with thumbnail and url", async () => {
      const { body } = await exec();
      await deleteImages();

      const image = body.images[0];

      expect(image.url.startsWith("http")).toBeTruthy();
      expect(image.thumbnailUrl.startsWith("http")).toBeTruthy();
    });

    it("should return the post if was saved successfully", async () => {
      const res = await exec();
      await deleteImages();

      expect(res.body.author.username).toBe(username);
      expect(res.body.message).toBe(message);
      expect(res.body.images.length).toBe(1);
    });
  });

  describe("/GET", () => {
    afterEach(async () => {
      deleteImages();
      await User.deleteMany({});
      await Post.deleteMany({});
    });

    it("should return every post with the resources URLs", async () => {
      const res = await createPost();

      expect(res.body.images[0].url.startsWith("http")).toBeTruthy();
      expect(res.body.images[0].thumbnailUrl.startsWith("http")).toBeTruthy();
    });
  });
});
