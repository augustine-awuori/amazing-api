const express = require("express");
const router = express.Router();

const { validate, Category } = require("../models/category");
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");
const validatingWith = require("../middleware/validate");

router.post("/", [auth, admin, validatingWith(validate)], async (req, res) => {
  const category = new Category({
    backgroundColor: req.body.backgroundColor,
    icon: req.body.icon,
    label: req.body.label,
  });

  await category.save();

  res.send(category);
});

router.get("/", async (req, res) => {
  const categories = await Category.find({}).sort("label");

  res.send(categories);
});

module.exports = router;
