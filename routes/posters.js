const express = require("express");
const router = express.Router();

const { Poster, validate } = require("../models/poster");
const auth = require("../middleware/auth");
const validateUser = require("../middleware/validateUser");
const validator = require("../middleware/validate");
const service = require("../services/posters");

router.post(
  "/",
  [auth, validateUser, validator(validate)],
  async (req, res) => {
    const { phone, image, position, speech } = req.body;

    const poster = new Poster({
      author: req.user._id,
      phone,
      image,
      position,
      speech,
    });
    await poster.save();

    res.send(await service.findById(poster._id));
  }
);

router.get("/", async (_req, res) => {
  const posters = await service.findAll();

  res.send(posters);
});

module.exports = router;
