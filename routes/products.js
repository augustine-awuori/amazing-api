const { isValidObjectId } = require("mongoose");
const express = require("express");
const router = express.Router();

const { validate, Product } = require("../models/product");
const auth = require("../middleware/auth");
const service = require("../services/products");
const shopService = require("../services/shop");
const validateUser = require("../middleware/validateUser");
const validator = require("../middleware/validate");
const validateProductId = require("../middleware/validateProductId");
const validateProductAuthor = require("../middleware/validateProductAuthor");

router.post(
  "/",
  [auth, validateUser, validator(validate)],
  async (req, res) => {
    const { author, description, name, price, shop, type, images } = req.body;

    const product = new Product({
      author,
      description,
      name,
      price,
      type,
      images,
      shop,
    });

    await product.save();

    const detailedShop = await shopService.findById(shop);
    if (!detailedShop) return res.status(404).send("Shop not found");

    if (!detailedShop.types[type]) {
      const updatedTypes = { ...detailedShop.types, [type]: type };
      await shopService.findByIdAndUpdate(shop, { types: updatedTypes });
    }

    const updatedProduct = await service.findById(product._id);
    res.send(updatedProduct);
  }
);

router.get("/:shopId", async (req, res) => {
  const shopId = req.params.shopId;
  if (!isValidObjectId(shopId))
    return res.status(400).send({ error: "Invalid shop Id" });

  const shopProducts = await service.findProductsOf(shopId);

  res.send(shopProducts);
});

router.get("/", async (_req, res) => {
  const products = await service.findAll();

  res.send(products);
});

router.get("/single/:productId", async (req, res) => {
  const product = await service.findById(req.params.productId);

  if (!product) return res.status(404).send({ error: "Product not found!" });

  service.informOthers(product);
  res.send(product);
});

router.patch(
  "/:id",
  [auth, validateUser, validateProductId, validateProductAuthor],
  async (req, res) => {
    const product = await service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    product
      ? res.send(product)
      : res.status(404).send({ error: "This product doesn't exist" });
  }
);

router.patch("/image/:id", auth, async (req, res) => {
  const image = req.body.image;
  if (!image) return res.status(400).send({ error: "Image not provided" });

  const product = await service.findByIdAndUpdate(
    req.params.id,
    { image },
    { new: true }
  );

  product
    ? res.send(product)
    : res.status(404).send({ error: "This product doesn't exist" });
});

router.delete("/:id", [auth, validateProductId], async (req, res) => {
  const product = await service.findById(req.params.id);

  if (!product)
    return res
      .status(404)
      .send({ error: "Product doesn't exist in the database" });

  if (
    product.author._id.toString() === req.user._id.toString() ||
    req.user.isAdmin
  )
    res.send(await service.findByIdAndDelete(product._id));

  return res.status(403).send({ error: "Unauthorised access!" });
});

module.exports = router;
