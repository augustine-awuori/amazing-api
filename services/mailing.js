const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");

const logo =
  "https://firebasestorage.googleapis.com/v0/b/kisii-campus-mart-site.appspot.com/o/logo.png?alt=media&token=19e3f069-ae48-46bc-8f54-1ad5c7fdae2e";

const transporter = nodemailer.createTransport({
  host: "live.smtp.mailtrap.io",
  port: 587,
  secure: false,
  auth: {
    user: "api",
    pass: process.env.EMAIL_PASS,
  },
});

function generateHTMLEmail({ name, intro }) {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Amazing",
      link: "https://soamazing.shop/",
      logo,
    },
  });

  return mailGenerator.generate({
    body: {
      name,
      intro,
      outro: `Always give feedback on anything! 💬 From what you'd like to see next on Amazing E-commerce... Happy Shopping! 🛍️`,
    },
  });
}

async function sendMail({ name, intro, to, subject }) {
  const generated = generateHTMLEmail({ name, intro });

  return await transporter.sendMail({
    from: "Amazing@demomailtrap.com",
    to,
    subject,
    text: generated ? "" : `Hello ${name}, ${intro}`,
    html: generated || "",
  });
}

module.exports = { sendMail };
