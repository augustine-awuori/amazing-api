const wbm = require("wbm");
const winston = require("winston");

const formatMessage = (message) =>
  `
${message}. 
FROM KISII UNIVERSE MART at https://kisiiuniversemart.digital
`;

const sendToMultiple = (phones = [], message = "") =>
  wbm
    .start()
    .then(async () => {
      await wbm.send(phones, formatMessage(message));
      await wbm.end();
    })
    .catch(winston.error);

const sendTo = async (phone = "", message = "") =>
  wbm
    .start()
    .then(async () => {
      await wbm.sendTo(phone, formatMessage(message));
      await wbm.end();
    })
    .catch(winston.error);

module.exports = { sendTo, sendToMultiple };
