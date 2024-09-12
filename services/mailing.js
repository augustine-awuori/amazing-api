const mailer = require("nodemailer");
const MailGen = require("mailgen");

const logo =
  "https://firebasestorage.googleapis.com/v0/b/kisii-campus-mart-site.appspot.com/o/logo.png?alt=media&token=19e3f069-ae48-46bc-8f54-1ad5c7fdae2e";

async function sendMail({ name, intro, to, subject }) {
  const from = "campuusmart@gmail.com";

  const htmlMail = new MailGen({
    theme: "default",
    product: {
      name: "Amazing",
      link: "https://soamazing.shop/",
      logo,
    },
  }).generate({
    body: {
      name,
      intro,
      outro: `
    Happy hustling!
    The Amazing Team

    P.S. Don't forget, you can request any features or improvements you'd like to see – we're all ears!`,
    },
  });

  return await mailer
    .createTransport({
      service: "gmail",
      auth: {
        user: from,
        pass: process.env.EMAIL_PASS,
      },
    })
    .sendMail({ from, to, subject, html: htmlMail });
}

module.exports = { sendMail };
