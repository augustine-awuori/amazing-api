const webpush = require("web-push");
const express = require("express");
const winston = require("winston");
const router = express.Router();

const { User } = require("../models/user");
const auth = require("../middleware/auth");

webpush.setVapidDetails(
  "mailto:codewithaugustine@gmail.com",
  process.env.publicVapidKey,
  process.env.privateVapidKey
);

router.post("/subscribe", auth, async (req, res) => {
  const user = await User.findById(req.user._id);
  const subscription = req.body;

  const isAlreadySubscribed = (user?.pushSubscriptions || []).some(
    (sub) => sub.endpoint === subscription.endpoint
  );
  if (isAlreadySubscribed)
    return res.status(200).send({ message: "User is already subscribed" });

  if (!user.pushSubscriptions) user.pushSubscriptions = [subscription];
  else user.pushSubscriptions = [...user.pushSubscriptions, subscription];

  await user.save();

  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: "Subscribed to Amazing Notifications",
        body: "You'll now be able to get notified for Amazing activities",
      })
    );
    res.status(201).send({ message: "Subscription successful  sent." });
  } catch (error) {
    winston.error(`Error sending/subscribing the notification: ${error}`);
    res.status(500).send({ error: "Failed to send notification" });
  }
});

router.post("/unsubscribe", auth, async (req, res) => {
  const user = await User.findById(req.user._id);
  const updated = (user?.pushSubscriptions || []).filter(
    (sub) => sub.endpoint !== req.body.endpoint
  );

  user.pushSubscriptions = updated;
  await user.save();

  res.send(200).send({ message: "Unsubscribed successfully" });
});

router.post("/notify/:userId", async (req, res) => {
  const user = await User.findById(req.params.userId);

  if (!user)
    return res.status(404).send({ error: "The intended user doesn't exist" });

  await notifyUser(user, req.body);
});

router.post("/notify", auth, async (req, res) => {
  const payload = JSON.stringify(
    req.body || { title: "Amazing Website", body: "You've unseen notification" }
  );

  (await User.find({})).forEach(
    async (user) => await notifyUser(user, payload)
  );

  res.send({ message: "Done sending notifications to all subscribers." });
});

async function notifyUser(user, notification) {
  (user?.pushSubscriptions || []).forEach(async (sub) => {
    try {
      await webpush.sendNotification(sub, notification);
    } catch (error) {
      winston.error(`Error sending notification: ${error}`);
    }
  });
}

module.exports = router;
