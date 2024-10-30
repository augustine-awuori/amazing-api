const express = require("express");
const router = express.Router();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const TWILIO_PHONE = '+12132973853';

router.post('/', async (req, res) => {
    const { text: body, to } = req.body;

    await client.messages
        .create({ body, to, from: TWILIO_PHONE, })
        .then(message =>
            res.send(message)
        ).catch(error => res.status(500).send({ error }));
});

module.exports = router;