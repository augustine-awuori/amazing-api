const express = require("express");
const router = express.Router();

const { validate } = require("../models/event");
const auth = require("../middleware/auth");
const service = require("../services/events");
const validateUser = require("../middleware/validateUser");
const validator = require("../middleware/validate");

router.post(
  "/",
  [auth, validateUser, validator(validate)],
  async (req, res) => {
    const event = await service.create(req.user, req.body);

    const found = await service.findById(event._id);

    return found
      ? res.send(found)
      : res.status(400).send({ error: "Invalid event details" });
  }
);

router.get("/", async (_req, res) => {
  const events = await service.getAll();

  res.send(events);
});

router.put(
  "/:id",
  [auth, validateUser, validator(validate)],
  async (req, res) => {
    const updated = await service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updated) return res.status(404).send({ error: "Event not found" });

    res.send(updated);
  }
);

router.patch("/:id", [auth, validateUser], async (req, res) => {
  let event = await service.findById(req.params.id);
  if (!event) return res.status(404).send("Event not found");

  if (
    event.author._id.toString() !== req.user._id.toString() ||
    !req.user.isAdmin
  )
    return res.status(403).send({ error: "Unathorised user" });

  const { name, username } = req.body;
  event.turnOut.push({ name, username });

  event = await event.save();

  res.send(await service.findById(event._id));
});

router.delete("/:id", [auth, validateUser], async () => {
  const event = await service.findById(req.params.id);

  if (!event) return res.status(404).send({ error: "Event doesn't exist" });

  if (
    event.author._id.toString() !== req.user._id.toString() ||
    !req.user.isAdmin
  )
    return res.status(403).send({ error: "Unathorised user" });

  service.findByIdAndDelete(event._id);
  res.status(200);
});

module.exports = router;
