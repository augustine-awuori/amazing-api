const multer = require("multer");
const express = require("express");
const router = express.Router();
const _ = require("lodash");

const { User } = require("../models/user");
const { validateListing, Listing } = require("../models/listing");
const auth = require("../middleware/auth");
const imageResize = require("../middleware/imageResize");
const listingCounter = require("../updaters/listings");
const imageMapper = require("../mappers/listings");
const validation = require("../middleware/validate");
const validateCategoryId = require("../middleware/validateCategoryId");
const validateUser = require("../middleware/validateUser");

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
  const listings = await Listing.find({}).sort("_id");

  const resources = listings.map(imageMapper);

  res.send(resources);
});

module.exports = router;
