const express = require("express");
const router = express.Router();

const { validate, Status } = require("../models/status");
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");
const validatingWith = require("../middleware/validate");

router.post("/", [auth, admin, validatingWith(validate)], async (req, res) => {
  const { color, label } = req.body;
  const status = new Status({ color, label });

  await status.save();

  res.send(status);
});

router.get("/", async (_req, res) => {
  const status = await Status.find({}).sort("_id");

  res.send(status);
});

module.exports = router;
