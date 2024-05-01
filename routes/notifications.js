const express = require("express");
const router = express.Router();

const { Notification } = require("../models/notification");
const auth = require("../middleware/auth");
const service = require("../services/notifications");

router.post("/", auth, async (req, res) => {
  const { description, title, to } = req.body;

  const notification = new Notification({
    description,
    title,
    to,
    from: req.user._id,
  });

  await notification.save();

  res.send(await service.findById(notification._id));
});

router.get("/:userId", auth, async (req, res) => {
  const notifications = await service.findByUserId(req.user._id);

  res.send(notifications);
});

router.patch("/:notificationId", auth, async (req, res) => {
  const notification = await service.findByIdAndUpdate(
    req.params.notificationId,
    req.body,
    { new: true }
  );

  notification
    ? res.send(notification)
    : res.status(404).send({ error: "Notification not found" });
});

module.exports = router;
