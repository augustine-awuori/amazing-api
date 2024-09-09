const express = require("express");
const router = express.Router();
const mailer = require('nodemailer');
const MailGen = require('mailgen');

export async function sendMail({ name, intro, to, subject }) {
    const from = 'campuusmart@gmail.com';

    const htmlMail = new MailGen({ theme: 'default', name: 'Mailgen', link: 'https://mailgen.js/' }).
        generate({
            body: {
                name, intro,
                outro: `
    Happy hustling!
    The Amazing Team

    P.S. Don't forget, you can request any features or improvements you'd like to see – we're all ears!`
            }
        });

    return await mailer.createTransport({
        service: 'gmail',
        auth: {
            user: from, pass: process.env.EMAIL_PASS
        }
    }).sendMail({ from, to, subject, html: htmlMail });
}

router.post('/', async (req, res) => {
    const { intro, name, subject, to } = req.body;

    const response = await sendMail({ intro, name, subject, to });

    (response.accepted)
        ? res.send(response.messageId)
        : res.status(500).send({ error: "Email couldn't be sent" })
});

module.exports = router;