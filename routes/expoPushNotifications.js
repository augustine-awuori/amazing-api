const { Expo } = require("expo-server-sdk");
const express = require("express");
const mongoose = require("mongoose");

const { User } = require("../models/user");
const auth = require("../middleware/auth");
const sendPushNotification = require("../utility/pushNotifications");

const router = express.Router();

router.post("/", auth, async (req, res) => {
    const { message, targetUsersId, title } = req.body;

    targetUsersId.forEach(async (targetUserId) => {
        if (!mongoose.isValidObjectId(targetUserId)) return;

        const targetUser = await User.findById(targetUserId);
        if (!targetUser) return;

        const { expoPushToken } = targetUser;
        sendPushNotificationTo([expoPushToken?.data], { message, title });
    });

    res.status(201).send();
});

export function sendPushNotificationTo(usersToken = [], { message, title }) {
    usersToken.forEach(async (token) => {
        if (Expo.isExpoPushToken(token))
            await sendPushNotification(token, { message, title });
    });
}

module.exports = router;
