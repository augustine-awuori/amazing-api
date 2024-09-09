const mailer = require('nodemailer');
const MailGen = require('mailgen');

async function sendMail({ name, intro, to, subject }) {
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

module.exports = { sendMail }
