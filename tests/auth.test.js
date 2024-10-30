const request = require("supertest");
const { User } = require("../models/user");

const endPoint = "/api/auth";

describe(endPoint, () => {
  let server;
  let username;
  let password;

  beforeEach(async () => {
    server = require("../index");
    username = "@augustine";
    password = "thisismynewpassword";
    await User.collection.insertOne({ username, password, name: "name" });
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  const exec = () =>
    request(server).post(endPoint).send({ username, password });

  describe("POST/", () => {
    it("should return 400 if username is null", async () => {
      username = "";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if password is null", async () => {
      password = "";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if username is less than 3 characters", async () => {
      username = "12";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if password is less than 5 characters", async () => {
      password = "1234";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if password is more than 1024 characters", async () => {
      password = new Array(1230).join("p");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if username is more than 50 characters", async () => {
      username = new Array(52).join("p");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if username doesn't exist", async () => {
      username = "new_username";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if password is incorrect", async () => {
      password = "incorrect";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return token if input is valid", async () => {
      await User.deleteMany({});
      await request(server)
        .post("/api/users")
        .send({ username, password, name: "name" });

      const res = await exec();
      const user = await User.findOne({ username });
      const token = user.generateAuthToken();

      expect(res.status).toBe(200);
      expect(res.text).toBeTruthy();
      expect(res.text).toBe(token);
    });
  });
});
