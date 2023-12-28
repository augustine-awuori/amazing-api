const mongoose = require("mongoose");
const multer = require("multer");
const express = require("express");
const router = express.Router();

const { deleteImages, saveImages } = require("../utility/imageManager");
const { User } = require("../models/user");
const { validateListing, Listing } = require("../models/listing");
const auth = require("../middleware/auth");
const service = require("../services/listings");
const productService = require("../services/products");
const validateCategoryId = require("../middleware/validateCategoryId");
const validateListingAuthor = require("../middleware/validateListingAuthor");
const validateListingId = require("../middleware/validateListingId");
const validateUser = require("../middleware/validateUser");
const validator = require("../middleware/validate");

const upload = multer({ dest: "uploads/" });

router.post(
  "/",
  [
    // Order of these middlewares matters
    upload.array("images", process.env.maxImagesCount),
    auth,
    validateUser,
    validateCategoryId,
    validator(validateListing),
  ],
  async (req, res) => {
    const { category, description, price, title } = req.body;

    const author = req.user._id;
    let images = req.files.map((image) => image.filename);
    const listing = new Listing({
      author,
      category,
      description,
      price,
      title,
      images,
    });

    await listing.save();
    await saveImages(req.files);
    service.informOthers(author, listing._id);

    res.send(await service.findById(listing._id));
  }
);

router.post("/to-product/:id", async (req, res) => {
  const listing = await service.findById(req.params.id);
  if (!listing) return res.status(404).send({ error: "Listing not found!" });

  const shop = req.body.shop;
  if (!shop) return res.status(400).send({ error: "Shop not specified!" });

  const product = await productService.createProductFrom(listing, shop);
  res.send(product);
});

router.get("/", async (_req, res) => {
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

  const userListings = (await service.getAll()).filter(
    ({ author }) => author._id.toString() === id
  );
  res.send(userListings);
});

router.delete("/:id", auth, async (req, res) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) return res.status(200);

  if (
    listing.author.toString() !== req.user._id.toString() &&
    !req.user.isAdmin
  )
    return res
      .status(403)
      .send({ error: "Unauthorised! You're not the owner" });

  deleteImages(listing.images);
  await service.findByIdAndDelete(listing._id);

  res.send(listing);
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
    const { _id, category, description, price, title } = req.body;

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
