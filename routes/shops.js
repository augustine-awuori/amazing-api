const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

const { User } = require("../models/user");
const { validateShop, Shop } = require("../models/shop");
const auth = require("../middleware/auth");
const service = require("../services/shop");
const validateUser = require("../middleware/validateUser");
const validator = require("../middleware/validate");
const mapAuthor = require("../middleware/mapAuthor");

router.post(
  "/",
  [auth, validateUser, mapAuthor, validator(validateShop)],
  async (req, res) => {
    const { author, name, types, location, image } = req.body;

    let shop = await service.findOne({ name });
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

router.get("/:name", async (req, res) => {
  const name = req.params.name;
  console.log("name", name);
  const shop = await service.findOne({ name });

  if (shop) return res.send(shop);

  const user = await User.findById(name);
  if (!user)
    return res
      .status(404)
      .send({ error: "Shop(s) related to the given ID doesn't exist" });

  res.send(await service.findByAuthorId(name));
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
