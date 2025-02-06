const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");

const logo =
  "https://firebasestorage.googleapis.com/v0/b/kisii-campus-mart-site.appspot.com/o/logo.png?alt=media&token=19e3f069-ae48-46bc-8f54-1ad5c7fdae2e";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function generateHTMLEmail({ message }) {
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
      name: "Amazer",
      intro: message,
      outro: "Shop with ease!",
    },
  });
}

async function sendMail({ message, to, subject }) {
  const htmlEmail = generateHTMLEmail({ message });

  return await transporter.sendMail({
    from: `"Sparkler" ${process.env.EMAIL_USER}`,
    to,
    subject,
    text: htmlEmail ? "" : `Hello Amazer, ${message}`,
    html: htmlEmail || "",
  });
}

module.exports = { sendMail };
