const mongoose = require("mongoose");
const multer = require("multer");
const express = require("express");
const router = express.Router();

const { saveImage, deleteImage } = require("../utility/imageManager");
const { User } = require("../models/user");
const { validateShop, Shop } = require("../models/shop");
const auth = require("../middleware/auth");
const service = require("../services/shop");
const userService = require("../services/users");
const validateDeleteAuthor = require("../middleware/validateDeleteAuthor");
const validateTypeId = require("../middleware/validateTypeId");
const validateUser = require("../middleware/validateUser");
const validator = require("../middleware/validate");
const mapAuthor = require("../middleware/mapAuthor");

const upload = multer({ dest: "uploads/" });

router.post(
  "/",
  [
    // Order of these middlewares matters
    upload.single("image", 1),
    auth,
    validateUser,
    validateTypeId,
    mapAuthor,
    validator(validateShop),
  ],
  async (req, res) => {
    const { name, type } = req.body;
    const author = await userService.findById(req.user._id);
    if (!author) return res.status(400).send({ error: "User not found!" });
    const image = req.file;
    if (!image)
      return res.status(500).send({ error: "Couldn't process image" });

    const shop = new Shop({
      author: req.user._id,
      name,
      type,
      image: image.filename,
    });
    author.hasShop = true;
    author.save();
    await shop.save();
    await saveImage(image);

    res.send(await service.findById(shop._id));
  }
);

router.get("/", async (_req, res) => {
  const shops = await service.getAll();

  res.send(shops);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  if (!mongoose.isValidObjectId(id))
    return res.status(400).send({ error: "Invalid ID." });

  const user = await User.findById(id);
  if (!user) {
    const shop = await service.findById(id);

    return shop
      ? res.send(shop)
      : res.status(404).send({ error: "Shop  doesn't exist." });
  }

  const userShops = (await service.getAll()).filter(
    ({ author }) => author._id.toString() === id
  );
  res.send(userShops);
});

router.delete("/:id", [auth, validateDeleteAuthor], async (req, res) => {
  const shop = await service.findByIdAndDelete(req.params.id);

  if (shop) deleteImage(shop.image);

  res.send(shop);
});

router.patch("/:id", [auth, validateUser], async (req, res) => {
  const { type, name } = req.body;

  const shop = await service.findByIdAndUpdate(
    req.params.id,
    { $set: { name, type } },
    { new: true }
  );

  shop
    ? res.send(shop)
    : res.status(404).send({ error: "This shop doesn't exist" });
});

module.exports = router;
