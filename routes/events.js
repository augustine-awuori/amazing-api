const express = require("express");
const router = express.Router();
const multer = require("multer");

const { Event, validate } = require("../models/event");
const {
  imageMapper,
  imageMappers,
  imageUnmapper,
} = require("../mappers/images");
const auth = require("../middleware/auth");
const getAuthor = require("../utility/getAuthor");
const imagesResize = require("../middleware/imagesResize");
const validator = require("../middleware/validate");

const upload = multer({
  dest: "uploads",
  limits: { fieldSize: 25 * 1024 * 1024 },
});

router.delete("/:id", auth, async (req, res) => {
  const event = await Event.findByIdAndDelete(req.params.id);

  if (!event)
    return res
      .status(400)
      .send({ error: "The event with the given ID doesn't exist." });
  if (event.author._id.toString() !== req.user._id.toString())
    return res
      .status(401)
      .send({ error: "Access Denied! You're not the event creator." });

  imageUnmapper(event);
  res.send(imageMapper(event));
});

router.post(
  "/",
  [auth, upload.array("images"), validator(validate), imagesResize],
  async (req, res) => {
    const { about, date, endTime, location, month, startTime, title } =
      req.body;

    let event = new Event({
      about,
      author: await getAuthor(req),
      date,
      endTime,
      location,
      month,
      startTime,
      title,
    });
    event.images = req.images.map((fileName) => ({ fileName }));

    await event.save();

    res.send(imageMapper(event));
  }
);

router.get("/", async (req, res) => {
  const events = await Event.find({}).sort("-_id");

  res.send(imageMappers(events));
});

router.put("/:id", [auth, validator(validate)], async (req, res) => {
  let event = await Event.findById(req.params.id);

  if (!event)
    return res.status(404).send({ error: "Failed! Event not found!" });
  if (event.author._id.toString() !== req.user._id.toString())
    return res
      .status(401)
      .send({ error: "Access Denied! You're not the event creator." });

  const { about, date, endTime, location, month, startTime, title } = req.body;
  event.about = about;
  event.date = date;
  event.endTime = endTime;
  event.location = location;
  event.month = month;
  event.startTime = startTime;
  event.title = title;
  await event.save();

  res.send(imageMapper(event));
});

module.exports = router;
