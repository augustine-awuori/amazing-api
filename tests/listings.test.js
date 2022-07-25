const request = require("supertest");

const { Category } = require("../models/category");
const { Listing } = require("../models/listing");
const { User } = require("../models/user");
const { imageUnmapper } = require("../mappers/listings");

const endPoint = "/api/listings";

describe(endPoint, () => {
  let category, server, user, userId, token, price, categoryId;
  let categoryLabel = "Utensils";
  let title = "title";
  let description = "";

  async function deleteImages() {
    const listing = await Listing.findOne({});
    if (listing) imageUnmapper(listing);
  }

  async function createCategory() {
    category = new Category({
      label: categoryLabel,
      icon: "floor-lamp",
      backgroundColor: "#fff",
    });
    categoryId = category._id;
    await category.save();
  }

  async function createUser() {
    user = new User({
      name: "Augustine Awuori",
      username: "awuoriaugustine",
      password: "123456",
    });
    token = user.generateAuthToken();
    userId = user._id;
    await user.save();
  }

  function createListing() {
    return request(server)
      .post(endPoint)
      .set("x-auth-token", token)
      .field("title", title)
      .field("price", price)
      .field("description", description)
      .field("categoryId", categoryId.toString())
      .attach("images", "public/test/assets/file.jpg");
  }

  const afterEachFuncs = async () => {
    await Category.deleteMany({});
    await User.deleteMany({});
    await Listing.deleteMany({});
  };

  beforeEach(() => {
    server = require("../index");
  });

  describe("/POST", () => {
    beforeEach(async () => {
      title = "iPhoneX";
      price = "200";
      description = "";
      image = "public/test/assets/file.jpg";

      createCategory();
      createUser();
    });

    afterEach(async () => {
      afterEachFuncs();
      await User.deleteMany({});
      deleteImages();
    });

    const exec = createListing;

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
      categoryId = userId;

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if the listing title is empty", async () => {
      title = "";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if the listing title is more than 50 chars", async () => {
      title = new Array(52).join("a");

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

  describe("/PUT", () => {
    let listing;
    let listingId;
    let authorId;
    let title;
    let description;

    beforeEach(async () => {
      await createUser();
      await createCategory();

      listing = new Listing({
        author: { _id: userId, name: user.name, username: user.username },
        category,
        description: "",
        price: "10",
        title: "iPhone X",
      });
      listingId = listing._id;
      await listing.save();

      authorId = userId;
      title = "New Iphone";
      description = "This is a simple description";
    });

    afterEach(() => afterEachFuncs());

    const exec = () =>
      request(server)
        .put(`${endPoint}/${listingId}`)
        .set("x-auth-token", token)
        .send({
          _id: listingId,
          authorId,
          title,
          price: "1000",
          description,
          categoryId,
        });

    it("should return 401 if token is not provided", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 400 if token is invalid", async () => {
      token = "1234";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if listing doesn't exist", async () => {
      await Listing.deleteMany({});

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 401 if the author isn't the  listing author", async () => {
      authorId = "1234";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 400 if the listing category doesn't exist", async () => {
      categoryId = userId;

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should have a price", async () => {
      await exec();

      const listing = await Listing.findOne({});

      expect(listing.price).toBeTruthy();
    });

    it("should have a title", async () => {
      await exec();

      const listing = await Listing.findOne({});

      expect(listing.title).toBeTruthy();
    });

    it("should save the listing with the new updates", async () => {
      const res = await exec();

      const listings = await Listing.find({});

      expect(res.status).toBe(200);
      expect(listings.length).toBe(1);
      expect(listings[0].title).toBe(title);
      expect(listings[0].description).toBe(description);
    });
  });

  describe("/GET", () => {
    beforeEach(async () => {
      await createCategory();
      await createUser();
      await createListing();
    });

    afterEach(() => {
      afterEachFuncs();
      deleteImages();
    });

    const exec = () => request(server).get(endPoint);

    it("should return 200 if listings are retrieved", async () => {
      const res = await exec();

      const listings = await Listing.find({});

      expect(res.status).toBe(200);
      expect(listings.length).toBe(1);
      expect(listings[0].category).toHaveProperty("_id");
      expect(listings[0].category).toHaveProperty("label");
      expect(listings[0].title).toBe(title);
    });
  });
});
