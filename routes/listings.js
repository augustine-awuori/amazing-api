const mongoose = require("mongoose");
const multer = require("multer");
const express = require("express");
const router = express.Router();
const config = require("config");

const { mapListing } = require("../mappers/listings");
const { User } = require("../models/user");
const { validateListing, Listing } = require("../models/listing");
const { saveImages, deleteImages } = require("../utility/imageManager");
const auth = require("../middleware/auth");
const service = require("../services/listingsService");
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
    upload.array("images", config.get("maxImagesCount")),
    auth,
    validateUser,
    validateCategoryId,
    validator(validateListing),
  ],
  async (req, res) => {
    const { categoryId: category, description, price, title } = req.body;

    const author = req.user._id;
    let images = req.files.map((file) => file.filename);
    let listing = { author, category, description, price, title, images };
    listing = new Listing(listing);

    await listing.save();
    await saveImages(req.files);

    res.send(await service.findById(listing._id));
  }
);

router.get("/", async (req, res) => {
  const listings = await service.getAll();

  res.send(listings);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  if (!mongoose.isValidObjectId(id))
    return res.status(400).send({ error: "Invalid ID." });

  const user = await User.findById(id);
  if (!user) {
    const listing = await service.findById(id);

    return listing
      ? res.send(listing)
      : res.status(404).send({ error: "Listing  doesn't exist." });
  }

  const userListings = res.send(
    (await service.getAll()).filter(
      ({ author }) => author._id.toString() === id
    )
  );
  res.send(userListings);
});

router.delete("/:id", [auth, validateDeleteAuthor], async (req, res) => {
  let listing = req.listing;

  deleteImages(listing.images);
  await Listing.deleteOne({ _id: req.params.id });

  res.send(await mapListing(listing));
});

router.patch(
  "/:id",
  [
    auth,
    validateUser,
    validateListingId,
    validateListingAuthor,
    validateCategoryId,
  ],
  async (req, res) => {
    const { _id, categoryId: category, description, price, title } = req.body;

    const listing = await service.findByIdAndUpdate(
      _id,
      { $set: { category, description, title, price } },
      { new: true }
    );

    listing
      ? res.send(listing)
      : res.status(404).send({ error: "This listing doesn't exist" });
  }
);

module.exports = router;
