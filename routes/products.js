const { isValidObjectId } = require("mongoose");
const multer = require("multer");
const express = require("express");
const router = express.Router();

const { saveImage, deleteImage } = require("../utility/imageManager");
const { validate, Product } = require("../models/product");
const auth = require("../middleware/auth");
const service = require("../services/products");
const validateUser = require("../middleware/validateUser");
const validator = require("../middleware/validate");
const validateProductId = require("../middleware/validateProductId");
const validateProductAuthor = require("../middleware/validateProductAuthor");

const upload = multer({ dest: "uploads/" });

router.post(
  "/",
  [upload.single("image", 1), auth, validateUser, validator(validate)],
  async (req, res) => {
    const { description, name, price, shop } = req.body;
    const author = req.user._id;
    const image = req.file;
    if (!image)
      return res.status(500).send({ error: "Couldn't process image" });

    const product = new Product({
      author,
      description,
      name,
      price,
      image: image.filename,
      shop,
    });
    await product.save();
    await saveImage(image);

    res.send(await service.findById(product._id));
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

router.patch(
  "/:id",
  [auth, validateUser, validateProductId, validateProductAuthor],
  async (req, res) => {
    const { description, name, price } = req.body;

    const product = await service.findByIdAndUpdate(
      req.params.id,
      { $set: { description, name, price } },
      { new: true }
    );

    product
      ? res.send(product)
      : res.status(404).send({ error: "This product doesn't exist" });
  }
);

router.delete(
  "/:id",
  [auth, validateProductId, validateProductAuthor],
  async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (product) deleteImage(product.image);

    res.send(product);
  }
);

module.exports = router;
