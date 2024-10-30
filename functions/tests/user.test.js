const request = require("supertest");
const fs = require("fs");

const { User } = require("../models/user");
const getUsers = require("../utility/getUsers");
const endpoint = "/api/users";
const outputFolder = "public/assets/";

describe(endpoint, () => {
  let server;
  let username = "@augustine";

  const deleteAvatar = async () => {
    const user = await User.findOne({ username });

    if (!user) return;

    fs.unlinkSync(`${outputFolder}${user.avatar.fileName}_full.jpg`);
    fs.unlinkSync(`${outputFolder}${user.avatar.fileName}_thumb.jpg`);
  };

  beforeEach(() => {
    server = require("../index");
  });

  describe("POST/", () => {
    let name = "Augustine";
    let password = "123456";

    const exec = () =>
      request(server)
        .post(endpoint)
        .field("name", name)
        .field("username", username)
        .field("password", password);

    const execWithAvatar = () =>
      request(server)
        .post(endpoint)
        .field("name", name)
        .field("username", username)
        .field("password", password)
        .attach("avatar", "public/test/assets/file.jpg");

    afterEach(async () => {
      await User.deleteMany({});
    });

    it("return 400 if the username is already taken", async () => {
      await exec();

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should save the user if input is valid", async () => {
      const res = await exec();

      const user = await User.findOne({ username });

      expect(res.status).toBe(200);
      expect(user).toBeTruthy();
    });

    it("should return the user token if input is valid", async () => {
      const res = await exec();

      expect(res.headers["x-auth-token"]).toBeTruthy();
    });

    it("should map avatar to an object with 'fileName' property", async () => {
      await execWithAvatar();

      const users = await getUsers();

      expect(users.length).toBe(1);
      users.forEach(({ avatar }) => expect(avatar).toHaveProperty("fileName"));

      await deleteAvatar();
    });

    it("should return 400 if name isn't provided", async () => {
      name = "";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if name is more than 50 chars", async () => {
      name = new Array(52).join("a");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if password is less than 6 chars", async () => {
      password = "12345";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if password is more than 1024 chars", async () => {
      password = new Array(1024).join("a");

      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if username isn't provided", async () => {
      username = "";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if username more than 50 chars", async () => {
      username = new Array(52).join("a");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if username already exists", async () => {
      await exec();

      const res = await exec();

      expect(res.status).toBe(400);
    });
  });
});
