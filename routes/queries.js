const express = require("express");
const router = express.Router();

const { Query, validate: validator } = require("../models/query");
const validate = require("../middleware/validate");

router.post('/', validate(validator), async (req, res) => {
    const query = new Query(req.body);

    await query.save();

    res.send(query)
});

router.get('/', async (req, res) => {
    const queries = await Query.find({});

    res.send(queries);
});

module.exports = router;