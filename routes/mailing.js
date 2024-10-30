const express = require("express");
const router = express.Router();

const { sendMail } = require('../services/mailing');

router.post('/', async (req, res) => {
    const { intro, name, subject, to } = req.body;

    const { accepted, messageId, response } = await sendMail({ intro, name, subject, to });

    (accepted)
        ? res.send({ messageId, response })
        : res.status(400).send({ error: "Email couldn't be sent" })
});

module.exports = router;