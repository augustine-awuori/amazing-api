const multer = require("multer");
const express = require("express");
const router = express.Router();

const { validateListing, Listing } = require("../models/listing");
const auth = require("../middleware/auth");
const imageResize = require("../middleware/imageResize");
const listingMapper = require("../mappers/listings");
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
      author: req.user,
      category: req.body.category,
      description: req.body.description,
      price: req.body.price,
      title: req.body.title,
    };
    listing.images = req.images.map((fileName) => ({ fileName }));
    listing = new Listing(listing);
    listing.count =
      (await Listing.find({
        author: { _id: req.user._id },
      }).count()) + 1;

    await listing.save();

    res.send(listing);
  }
);

module.exports = router;
