const multer = require("multer");
const express = require("express");
const router = express.Router();
const _ = require("lodash");

const { imageMapper, imageUnmapper } = require("../mappers/listings");
const {
  updateAuthorListingsCount,
  getFreshListings,
} = require("../updaters/listings");
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
const validation = require("../middleware/validate");

const upload = multer({
  dest: "uploads/",
  limits: { fieldSize: 25 * 1024 * 1024 },
});

router.post(
  "/",
  [
    // Order of these middlewares matters
    auth,
    upload.array("images", process.env.MAX_IMAGE_COUNT),
    validateUser,
    validateCategoryId,
    mapListing,
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
    updateAuthorListingsCount(listing.author);

    res.send(imageMapper(listing));
  }
);

router.get("/", async (req, res) => {
  const listings = await Listing.find({}).sort("-_id");

  const resources = listings.map(imageMapper);

  res.send(await getFreshListings(resources));
});

router.delete(
  "/:id",
  [auth, validateDeleteListing, validateDeleteAuthor],
  async (req, res) => {
    let listing = req.listing;

    imageUnmapper(listing);
    await Listing.deleteOne({ _id: req.params.id });
    await updateAuthorListingsCount(req.listing.author);

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

module.exports = router;
