const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "live.smtp.mailtrap.io",
  port: 587,
  secure: false,
  auth: {
    user: "api",
    pass: process.env.EMAIL_PASS,
  },
});

async function sendMail({ name, intro, to, subject }) {
  return await transporter.sendMail({
    from: "info@demomailtrap.com",
    to,
    subject,
    text: `Hello ${name}, ${intro}`
  });
}

module.exports = { sendMail }