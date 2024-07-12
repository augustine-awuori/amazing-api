const express = require("express");
const router = express.Router();

const { Notification, validate } = require("../models/notification");
const auth = require("../middleware/auth");
const service = require('../services/notifications');
const validateWith = require("../middleware/validate");

router.post('/', [auth, validateWith(validate)], async (req, res) => {
    const notificaton = new Notification(req.body);

    await notificaton.save();

    res.send(await service.findById(notificaton._id));
});

router.get('/buyer', auth, async (req, res) => {
    const notifications = await service.findByBuyerId(req.user._id);

    res.send(notifications)
});

router.get('/seller', auth, async (req, res) => {
    const notifications = await service.findByBuyerId(req.user._id);

    res.send(notifications)
});

router.patch('/:id', auth, async (req, res) => {
    const notification = await service.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!notification) return res.status(400).send({ error: 'Invalid notification ID' });

    res.send(notification);
});

module.exports = router;