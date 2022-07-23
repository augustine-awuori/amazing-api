const multer = require("multer");
const express = require("express");
const router = express.Router();
const _ = require("lodash");

const { imageMapper, imageUnmapper } = require("../mappers/listings");
const { User } = require("../models/user");
const { validateListing, Listing } = require("../models/listing");
const auth = require("../middleware/auth");
const imageResize = require("../middleware/imageResize");
const listingCounter = require("../updaters/listings");
const validateCategoryId = require("../middleware/validateCategoryId");
const validateListingAuthor = require("../middleware/validateListingAuthor");
const validateListingId = require("../middleware/validateListingId");
const validateUser = require("../middleware/validateUser");
const validation = require("../middleware/validate");

const upload = multer({
  dest: "uploads/",
  limits: { fieldSize: 25 * 1024 * 1024 },
});

router.post(
  "/",
  [
    // Order of this middlewares matters
    upload.array("images", process.env.MAX_IMAGE_COUNT),
    auth,
    validateUser,
    validateCategoryId,
    validation(validateListing),
    imageResize,
  ],
  async (req, res) => {
    let listing = {
      author: _.pick(await User.findById(req.user._id), [
        "_id",
        "avatar",
        "name",
        "username",
      ]),
      category: req.body.category,
      description: req.body.description,
      price: req.body.price,
      title: req.body.title,
    };
    listing.images = req.images.map((fileName) => ({ fileName }));
    listing = new Listing(listing);

    await listing.save();
    listingCounter(listing);

    res.send(listing);
  }
);

router.get("/", async (req, res) => {
  const listings = await Listing.find({}).sort("-_id");

  const resources = listings.map(imageMapper);

  res.send(resources);
});

router.put(
  "/:id",
  [auth, validateListingId, validateListingAuthor, validateCategoryId],
  async (req, res) => {
    const { description, price, title } = req.body;
    let listing = req.listing;
    listing.title = title;
    listing.price = price;
    listing.category = req.category;
    listing.description = description;

    await listing.save();

    res.send(listing);
  }
);

module.exports = router;
