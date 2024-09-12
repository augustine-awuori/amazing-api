const express = require("express");
const router = express.Router();

const { sendEmail } = require("../services/email");

router.post("/", async (req, res) => {
    const { email, subject, body } = req.body;

    const { ok } = await sendEmail({ body, email, subject });

    ok
        ? res.send({ message: "Email sent" })
        : res.status(500).send({ error: "Email could not be sent" });
});

module.exports = router;
