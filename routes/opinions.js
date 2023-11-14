const express = require("express");
const router = express.Router();

const { Opinion } = require("../models/opinion");

router.post("/", async (req, res) => {
  const opinion = new Opinion({ text: req.body.comment });

  await opinion.save();

  res.send(opinion);
});

router.get("/", async (_req, res) => {
  const opinions = await Opinion.find({}).sort("-_id");

  res.send(opinions);
});

module.exports = router;
