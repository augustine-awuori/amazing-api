const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

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

router.post(
  "/",
  [auth, validateUser, validateCategoryId, validator(validateListing)],
  async (req, res) => {

    const listing = new Listing({
      author: req.user._id,
      ...req.body
    });
    await listing.save();

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
    const { _id, category, description, price, title, images } = req.body;
    const updated = {};

    if (_id) updated._id = _id;
    if (category) updated.category = category;
    if (description) updated.description = description;
    if (price) updated.price = price;
    if (title) updated.title = title;
    if (images?.length) updated.images = images;

    const listing = await service.findByIdAndUpdate(
      _id,
      { $set: { ...updated } },
      { new: true }
    );

    listing
      ? res.send(listing)
      : res.status(404).send({ error: "This listing doesn't exist" });
  }
);

module.exports = router;
