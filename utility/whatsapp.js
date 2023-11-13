const { create } = require("apisauce");

const { getWhatsAppNumberFromUser } = require("./func");
const userService = require("../services/users");

const apiClient = create({ baseURL: "https://graph.facebook.com/v18.0" });

const sendMessage = async (phone = "", message = "") =>
  await apiClient.post(`/+254796720289/messages`, {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: checkPhoneNumber(phone),
    type: "text",
    text: {
      preview_url: false,
      body: message,
    },
  });

const sendMessageToAllExcept = async (exceptionUserId, message) =>
  (await userService.getAll()).forEach((user) => {
    if (!isTheException(user, exceptionUserId))
      sendMessage(getWhatsAppNumberFromUser(user), addInfoTo(message));
  });

function isTheException(user, exceptionUserId) {
  return user._id.toString() === exceptionUserId.toString();
}

function addInfoTo(message) {
  return `${message}.
  You can always control the type of messages to receive from your profile settings
  `;
}

function checkPhoneNumber(number = "") {
  return number.startsWith("+") ? number : `+${number}`;
}

module.exports = {
  checkPhoneNumber,
  sendMessage,
  sendMessageToAllExcept,
};
