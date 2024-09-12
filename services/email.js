const { Recipient, EmailParams, MailerSend } = require("mailersend");

const APP_EMAIL_ADDRESS = "campuusmart@gmail.com";
const APP_NAME = "Amazing";

const mailersend = new MailerSend({
    apiKey: process.env.MAIL_SENDER_API_KEY,
});

function getRecipient(email) {
    return [new Recipient(email, "Recipient")];
}

const createHtmlMessage = (subject, body) => {
    return `
        <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                    }
                    .container {
                        padding: 20px;
                        border: 1px solid #e0e0e0;
                        border-radius: 8px;
                    }
                    h1 {
                        color: #333;
                    }
                    p {
                        font-size: 16px;
                    }
                    .footer {
                        margin-top: 20px;
                        font-size: 14px;
                        color: #777;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>${subject}</h1>
                    <p>${body}</p>
                    <div class="footer">
                        <p>Best regards,<br />${APP_NAME} Team</p>
                        <p><a href="mailto:${APP_EMAIL_ADDRESS}">Contact Us</a></p>
                    </div>
                </div>
            </body>
        </html>
    `;
};

async function sendEmail({ email, subject, body }) {
    const recipients = getRecipient(email);
    const htmlMessage = createHtmlMessage(subject, body);

    const emailParams = new EmailParams()
        .setFrom(APP_EMAIL_ADDRESS)
        .setFromName(APP_NAME)
        .setRecipients(recipients)
        .setSubject(subject)
        .setHtml(htmlMessage)
        .setText(body);

    try {
        await mailersend.send(emailParams);
        return { ok: true };
    } catch (error) {
        return { ok: false };
    }
}

module.exports = { sendEmail };
