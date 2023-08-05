const { isValidObjectId } = require("mongoose");
const multer = require("multer");
const express = require("express");
const router = express.Router();
const config = require("config");
const AWS = require("aws-sdk");
const fs = require("fs");

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

AWS.config.update({
  credentials: {
    accessKeyId: config.get("mart_awsAccessKey"),
    secretAccessKey: config.get("mart_awsSecretAccessKey"),
  },
  region: "us-east-1",
});

const s3 = new AWS.S3();

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
    const { categoryId, description, price, title } = req.body;
    const authorId = req.user._id;

    let listing = { authorId, categoryId, description, price, title };
    listing.images = (req.files || []).map(async (file) => {
      const c = await s3
        .upload({
          Body: fs.createReadStream(file.path),
          Bucket: "kisii-universe-mart-bucket",
          Key: file.filename,
        })
        .promise();

      return { url: c.Location };
    });
    listing = new Listing(listing);
    await listing.save();

    res.send(listing);
  }
);

router.get("/", async (req, res) => {
  const listings = await Listing.find({}).sort("-_id");

  const resources = await mapListings(listings);

  res.send(resources);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  if (!isValidObjectId(id))
    return res.status(400).send({ error: "Invalid ID." });

  const user = await User.findById(id);
  if (!user) {
    let listing = await Listing.findById(id);

    if (!listing)
      return res
        .status(404)
        .send({ error: "Listing with the gived ID doesn't exist." });

    return listing
      ? res.send(await mapListing(listing))
      : res.status(404).send({ error: "Id provided doesn't exist." });
  }

  const listings = (await Listing.find({}).sort("-_id")).filter(
    ({ authorId }) => authorId.toString() === req.params.id
  );

  res.send(listings);
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
