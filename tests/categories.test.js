const request = require("supertest");

const { Category } = require("../models/category");
const { User } = require("../models/user");

const endPoint = "/api/categories";

describe(endPoint, () => {
  let categories;
  let server;
  let token;

  beforeEach(async () => {
    categories = [
      { icon: "icon", backgroundColor: "#fff", label: "Furniture" },
      { icon: "icon1", backgroundColor: "#fff", label: "Cameras" },
    ];
    server = require("../index");
    token = new User().generateAuthToken();
    await Category.collection.insertMany(categories);
  });

  afterEach(async () => {
    await Category.deleteMany({});
    await User.deleteMany({});
    categories = [];
    token = "";
  });

  describe("GET/", () => {
    const exec = () => request(server).get(endPoint).set("x-auth-token", token);

    it("should return 401 if the token is not provided", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return all the categories", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((c) => c.icon === "icon")).toBeTruthy();
      expect(res.body.some((c) => c.icon === "icon1")).toBeTruthy();
    });
  });

  describe("POST/", () => {
    let isAdmin = {};
    let icon;
    let backgroundColor;
    let label;

    beforeEach(async () => {
      await Category.deleteMany({});
      isAdmin = { isAdmin: true };
      token = new User(isAdmin).generateAuthToken();

      icon = "icon1";
      backgroundColor = "#000";
      label = "Furniture";
    });

    const exec = () =>
      request(server)
        .post(endPoint)
        .set("x-auth-token", token)
        .send({ icon, backgroundColor, label });

    it("should return 401 if the token is not provided", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 400 if the token is invalid", async () => {
      token = "123";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 401 if the user is not an admin", async () => {
      token = new User().generateAuthToken();

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 200 if the user is an admin", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
    });

    it("should return 400 if icon is not set", async () => {
      icon = "";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if icon is more than 50 characters", async () => {
      icon = new Array(52).join("a");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if background color is less than 4 characters", async () => {
      backgroundColor = "123";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if background color is more than 10 characters", async () => {
      backgroundColor = new Array(12).join("a");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if label is less than 3 characters", async () => {
      label = "12";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if label is more than 50 characters", async () => {
      label = new Array(52).join("a");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should save the category if input is valid", async () => {
      await exec();

      const category = await Category.findOne({ label });

      expect(category).toBeTruthy();
      expect(category.label).toBe(label);
      expect(category.icon).toBe(icon);
      expect(category.backgroundColor).toBe(backgroundColor);
    });

    it("should return 200 if input is valid", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
    });

    it("should return the category if input is valid and it is saved", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("icon", icon);
      expect(res.body).toHaveProperty("label", label);
      expect(res.body).toHaveProperty("backgroundColor", backgroundColor);
    });
  });
});
