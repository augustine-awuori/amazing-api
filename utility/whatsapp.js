// const { Client } = require("whatsapp-web.js");
const winston = require("winston");

const client = new Client();

const init = () => {
  // client.on("ready", () => winston.info("WhatsApp Messenger is ready!"));

  client.initialize();
};

const formatMessage = (message) =>
  `
${message}. 
FROM KISII UNIVERSE MART at https://kisiiuniversemart.digital
`;

const sendTo = (phone = "", message = "") => {
  // client.sendMessage(phone, formatMessage(message));
};

const sendToMultiple = (phones = [], message = "") => {
  const formattedMessage = formatMessage(message);

  phones.forEach((phone) => sendTo(phone, formattedMessage));
};

module.exports = { init, sendTo, sendToMultiple };
