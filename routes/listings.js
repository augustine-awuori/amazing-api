const multer = require("multer");
const express = require("express");
const router = express.Router();

const {
  imageUnmapper,
  mapListing,
  mapListings,
} = require("../mappers/listings");
const { User } = require("../models/user");
const { validateListing, Listing } = require("../models/listing");
const auth = require("../middleware/auth");
const imageResize = require("../middleware/imagesResize");
const validateCategoryId = require("../middleware/validateCategoryId");
const validateDeleteAuthor = require("../middleware/validateDeleteAuthor");
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
    validator(validateListing),
    imageResize,
  ],
  async (req, res) => {
    const { categoryId, description, price, title } = req.body;
    const authorId = req.user._id;

    let listing = { authorId, categoryId, description, price, title };
    listing.images = req.images.map((fileName) => ({ fileName }));
    listing = new Listing(listing);
    await listing.save();

    res.send(mapListing(listing));
  }
);

router.get("/", async (req, res) => {
  const listings = await Listing.find({}).sort("-_id");

  const resources = await mapListings(listings);

  res.send(resources);
});

router.get("/:id", async (req, res) => {
  const listings = (await Listing.find({}).sort("-_id")).filter(
    ({ authorId }) => authorId.toString() === req.params.id
  );

  res.send(await mapListings(listings));
});

router.delete("/:id", [auth, validateDeleteAuthor], async (req, res) => {
  let listing = req.listing;

  imageUnmapper(listing);
  await Listing.deleteOne({ _id: req.params.id });

  res.send(listing);
});

router.patch(
  "/:id",
  [auth, validateListingId, validateListingAuthor, validateCategoryId],
  async (req, res) => {
    const { _id, categoryId, description, price, title } = req.body;

    const listing = await Listing.updateOne(
      { _id },
      { $set: { categoryId, description, title, price } },
      { new: true }
    );

    res.send(listing);
  }
);

module.exports = router;
