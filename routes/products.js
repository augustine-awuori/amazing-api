const { isValidObjectId } = require("mongoose");
const express = require("express");
const router = express.Router();

const { validate, Product } = require("../models/product");
const { View } = require("../models/view");
const auth = require("../middleware/auth");
const service = require("../services/products");
const shopService = require("../services/shop");
const validateProductAuthor = require("../middleware/validateProductAuthor");
const validateProductId = require("../middleware/validateProductId");
const validateUser = require("../middleware/validateUser");
const validator = require("../middleware/validate");

router.post(
  "/",
  [auth, validateUser, validator(validate)],
  async (req, res) => {
    const product = new Product({ ...req.body });
    await product.save();

    const { shop, type } = req.body;
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

  res.send(product);
});

router.patch('/views/:productId', auth, async (req, res) => {
  const productId = req.params.productId;
  const userId = req.user._id;

  const product = await Product.findById(productId);
  if (!product) return res
    .status(404)
    .send({ error: 'The product with the given ID does not exist in the database' });

  let viewed = false;
  product.views.forEach(view => {
    if (!view) return;

    if (view.viewer?.toString() === userId?.toString()) {
      viewed = true;
      return;
    }
  });

  if (viewed) return res.send(await service.findById(product._id));

  const view = new View({ viewer: userId });
  await view.save();

  const views = [...(product.views || []), view._id];
  const updated = await service.findByIdAndUpdate(productId, { views }, { new: true });
  res.send(updated);
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
