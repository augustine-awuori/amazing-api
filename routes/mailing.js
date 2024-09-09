const express = require("express");
const router = express.Router();

const { sendMail } = require('../services/mailing');

router.post('/', async (req, res) => {
    const { intro, name, subject, to } = req.body;

    const response = await sendMail({ intro, name, subject, to });

    (response.accepted)
        ? res.send(response.messageId)
        : res.status(500).send({ error: "Email couldn't be sent" })
});

module.exports = router;