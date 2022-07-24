const request = require("supertest");

const { Category } = require("../models/category");
const { Listing } = require("../models/listing");
const { User } = require("../models/user");
const { imageUnmapper } = require("../mappers/listings");

const endPoint = "/api/listings";

describe(endPoint, () => {
  let category;
  let categoryLabel = "Utensils";
  let categoryId;
  let listing;
  let server;
  let images = [];

  const beforeEachFuncs = async () => {
    category = new Category({
      label: categoryLabel,
      icon: "floor-lamp",
      backgroundColor: "#fff",
    });
    categoryId = category._id;
    await category.save();

    // user = new User({
    //   name: "Augustine Awuori",
    //   username: "awuoriaugustine",
    //   password: "123456",
    // });
    // token = user.generateAuthToken();

    // console.log("aval users", users);
    // listing = new Listing({
    //   author: { _id: user._id, name: user.name, username: user.username },
    //   category,
    //   description: "",
    //   price: "10",
    //   title: "iPhone X",
    // });
    // await listing.save();
  };

  const afterEachFuncs = async () => {
    await Category.deleteMany({});
    await User.deleteMany({});
    await Listing.deleteMany({});
  };

  beforeEach(() => {
    server = require("../index");
  });

  describe("/POST", () => {
    let listingTitle;
    let price;
    let user;
    let token;
    let description;
    let image;

    beforeEach(async () => {
      listingTitle = "iPhoneX";
      price = "200";
      description = "";
      image = "public/test/assets/file.jpg";

      beforeEachFuncs();

      user = new User({
        name: "Augustine Awuori",
        username: "awuoriaugustine",
        password: "123456",
      });
      token = user.generateAuthToken();
      await user.save();
    });

    afterEach(async () => {
      afterEachFuncs();
      await User.deleteMany({});
      deleteImages();
    });

    async function deleteImages() {
      const listing = await Listing.findOne({});
      if (listing) imageUnmapper(listing);
    }

    const exec = () =>
      request(server)
        .post(endPoint)
        .set("x-auth-token", token)
        .field("title", listingTitle)
        .field("price", price)
        .field("description", description)
        .field("categoryId", categoryId.toString())
        .attach("images", image);

    it("should return 401 if the token is not provided", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 400 if the token is invalid", async () => {
      token = "1234";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if the user does not exist", async () => {
      token = new User().generateAuthToken();

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if the category doesn't exist", async () => {
      await Category.collection.deleteMany({});

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if the listing title is empty", async () => {
      listingTitle = "";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if the listing title is more than 50 chars", async () => {
      listingTitle = new Array(52).join("a");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if the listing price is more than Ksh. 100_000", async () => {
      price = "1000000";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if the listing price is less than Ksh. 1", async () => {
      price = "0.5";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if the description is more than 200 chars", async () => {
      description = new Array(202).join("a");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should map each image to an object with  'fileName' property", async () => {
      await exec();

      const listing = await Listing.findOne({});

      expect(listing.images.length).toBe(1);
      listing.images.forEach((image) =>
        expect(image).toHaveProperty("fileName")
      );
    });

    it("should set listing count to 1", async () => {
      await exec();

      const listing = await Listing.findOne({});

      expect(listing.count).toBe(1);
    });

    it("should save the listing if it's valid", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
    });
  });

  // describe("/PUT", () => {
  //   const exec = () =>
  //     request(server).put(endPoint).set("x-auth-token", token).send(listing);

  //   it("should return 401 if token is not provided", async () => {
  //     token = "";

  //     const res = await exec();

  //     expect(res.status).toBe(401);
  //   });
  // });

  // describe("/GET", () => {
  //   it("should return 200 if listings are retrieved", async () => {
  //     const res = await request(server).get(endPoint);

  //     expect(res.status).toBe(200);
  //   });
  // });
});
