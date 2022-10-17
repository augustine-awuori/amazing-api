const multer = require("multer");
const express = require("express");
const router = express.Router();
const _ = require("lodash");

const {
  imageMapper,
  imageUnmapper,
  mapListings,
} = require("../mappers/listings");
const { updateAuthorListingsCount, getValid } = require("../updaters/listings");
const { User } = require("../models/user");
const { validateListing, Listing } = require("../models/listing");
const auth = require("../middleware/auth");
const imageResize = require("../middleware/imagesResize");
const mapCategory = require("../middleware/mapCategory");
const mapListing = require("../middleware/mapListing");
const validateCategoryId = require("../middleware/validateCategoryId");
const validateDeleteAuthor = require("../middleware/validateDeleteAuthor");
const validateDeleteListing = require("../middleware/validateDeleteListing");
const validateListingAuthor = require("../middleware/validateListingAuthor");
const validateListingId = require("../middleware/validateListingId");
const validateUser = require("../middleware/validateUser");
const validator = require("../middleware/validate");

const upload = multer({
  dest: "uploads/",
  limits: { fieldSize: 25 * 1024 * 1024 },
});

router.post(
  "/",
  [
    // Order of these middlewares matters
    upload.array("images", process.env.MAX_IMAGE_COUNT),
    auth,
    validateUser,
    validateCategoryId,
    mapListing,
    validator(validateListing),
    imageResize,
  ],
  async (req, res) => {
    const author = await getAuthor(req);
    const { category, description, price, title } = req.body;
    const count = (await getAuthorListingsCount(author)) + 1;

    let listing = { author, category, count, description, price, title };
    listing.images = req.images.map((fileName) => ({ fileName }));
    listing = new Listing(listing);
    await listing.save();

    res.send(imageMapper(listing));
  }
);

router.get("/", async (req, res) => {
  const listings = await Listing.find({}).sort("-_id");

  const resources = mapListings(listings);

  res.send(getValid(resources));
});

router.get("/:id", auth, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user)
    return res.status(404).send("The user with the given ID doesn't exist.");

  const listings = await Listing.find({
    author: _.pick(user, ["_id", "name", "username", "avatar"]),
  });

  res.send(mapListings(listings));
});

router.delete(
  "/:id",
  [auth, validateDeleteListing, validateDeleteAuthor],
  async (req, res) => {
    let listing = req.listing;

    imageUnmapper(listing);
    await Listing.deleteOne({ _id: req.params.id });
    await updateAuthorListingsCount(listing.author);

    res.send(listing);
  }
);

router.patch(
  "/:id",
  [
    auth,
    validateListingId,
    validateListingAuthor,
    validateCategoryId,
    mapCategory,
  ],
  async (req, res) => {
    const { _id, description, price, title } = req.body;

    const listing = await Listing.updateOne(
      { _id },
      { $set: { description, title, price } },
      { new: true }
    );

    res.send(listing);
  }
);

async function getAuthor(req) {
  const user = await User.findById(req.user._id);

  return _.pick(user, ["_id", "avatar", "name", "username"]);
}

async function getAuthorListingsCount(author) {
  return await Listing.find({ author }).count();
}

module.exports = router;
