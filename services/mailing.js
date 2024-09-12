const mailer = require("nodemailer");
const MailGen = require("mailgen");

const APP_LOGO =
  "https://firebasestorage.googleapis.com/v0/b/kisii-campus-mart-site.appspot.com/o/logo.png?alt=media&token=19e3f069-ae48-46bc-8f54-1ad5c7fdae2e";

const APP_EMAIL_ADDRESS = "campuusmart@gmail.com";

function generateMail({ name, intro }) {
  return new MailGen({
    theme: "default",
    product: {
      name: "Amazing",
      link: "https://soamazing.shop/",
      logo: APP_LOGO,
    },
  }).generate({
    body: {
      name,
      intro,
      action: {
        instructions: "To get back to the site, please click here:",
        button: {
          color: "#22BC66",
          link: "https://soamazing.shop",
        },
      },
      outro: `
    Happy hustling!
    The Amazing Team

    P.S. Don't forget, you can request any features or improvements you'd like to see – we're all ears!`,
    },
  });
}

function getMailTransport() {
  return mailer.createTransport({
    service: "gmail",
    auth: {
      user: APP_EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASS,
    },
  });
}

async function sendMail({ name, intro, to, subject }) {
  return await getMailTransport().sendMail({
    from: APP_EMAIL_ADDRESS,
    to,
    subject,
    html: generateMail({ name, intro }),
  });
}

module.exports = { sendMail };
