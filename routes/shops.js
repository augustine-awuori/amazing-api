const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

const { User } = require("../models/user");
const { validateShop, Shop } = require("../models/shop");
const auth = require("../middleware/auth");
const service = require("../services/shop");
const validateTypeId = require("../middleware/validateTypeId");
const validateUser = require("../middleware/validateUser");
const validator = require("../middleware/validate");
const mapAuthor = require("../middleware/mapAuthor");

router.post(
  "/",
  [auth, validateUser, validateTypeId, mapAuthor, validator(validateShop)],
  async (req, res) => {
    const { author, name, types, location, image } = req.body;

    let shop = await service.find({ name });
    if (shop)
      return res.status(400).send({ error: "This name is already taken" });

    shop = new Shop({ author, name, types, image, location });
    await shop.save();

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
      : res.status(404).send({ error: "Shop doesn't exist." });
  }

  res.send(await service.findByAuthorId(id));
});

router.delete("/:id", auth, async (req, res) => {
  const shop = await Shop.findById(req.params.id);
  const user = req.user;

  if (!shop) return res.status(200);

  if (shop.author.toString() !== user._id.toString() && !user.isAdmin)
    return res
      .status(403)
      .send({ error: "Unauthorised! You're not the owner" });

  await service.findByIdAndDelete(shop._id);

  res.send(shop);
});

router.patch("/views/:shopId", async (req, res) => {
  const shop = await service.findByIdAndUpdate(
    req.params.shopId,
    { $inc: { views: 1 } },
    { new: true }
  );

  shop
    ? res.send(shop)
    : res.status(404).send({ error: "This shop doesn't exist" });
});

router.patch("/:id", [auth, validateUser], async (req, res) => {
  const shop = await service.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  shop
    ? res.send(shop)
    : res.status(404).send({ error: "This shop doesn't exist" });
});

module.exports = router;
