const express = require("express");
const router = express.Router();

const { validate, Service } = require('../models/service');
const auth = require("../middleware/auth");
const service = require("../services/service");
const validator = require("../middleware/validate");

router.post('/', [auth, validator(validate)], async (req, res) => {
    const newService = new Service({
        author: req.user._id,
        ...req.body
    });

    await newService.save();

    res.send(await service.findById(newService._id));
});

router.get('/', async (_req, res) => {
    const services = await service.findAll();

    res.send(services);
});

module.exports = router;