const express = require("express");
const router = express.Router();

const { validate, Type } = require("../models/type");
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");
const validatingWith = require("../middleware/validate");

router.post("/", [auth, admin, validatingWith(validate)], async (req, res) => {
  const type = new Type({ label: req.body.label });

  await type.save();

  res.send(type);
});

router.get("/", async (_req, res) => {
  const types = await Type.find({}).sort("_id");

  res.send(types);
});

router.get("/:id", async (req, res) => {
  const type = await Type.findById(req.params.id);

  if (!type)
    return res
      .status(404)
      .send({ error: "The type with the given ID doesn't exist" });

  res.send(type);
});

module.exports = router;
