const request = require("supertest");

const { Category } = require("../../models/category");
const { User } = require("../../models/user");

describe("api/categories", () => {
  let categories;
  let server;
  let token;

  beforeEach(async () => {
    categories = [
      { icon: "icon", backgroundColor: "#fff", label: "Furniture" },
      { icon: "icon1", backgroundColor: "#fff", label: "Cameras" },
    ];
    server = require("../../index");
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
    const exec = () =>
      request(server).get("/api/categories").set("x-auth-token", token);

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
});
