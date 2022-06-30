const multer = require("multer");
const express = require("express");
const router = express.Router();

const { validateListing, Listing } = require("../models/listing");
const auth = require("../middleware/auth");
const imageResize = require("../middleware/imageResize");
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
    validation(validateListing),
    validateCategoryId,
    imageResize,
  ],
  async (req, res) => {
    let listing = {
      title: req.body.title,
      price: req.body.price,
      categoryId: req.body.categoryId,
      description: req.body.description,
      userId: req.user._id,
    };
    listing.images = req.images.map((fileName) => ({ fileName }));
    listing = new Listing(listing);
    await listing.save();

    res.send(listing);
  }
);

module.exports = router;
