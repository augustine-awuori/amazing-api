const { create } = require("apisauce");

const apiClient = create({ baseURL: "https://graph.facebook.com/v18.0" });

const sendMessage = async (phone = "", message = "") =>
  await apiClient.post(`/+254796720289/messages`, {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: phone,
    type: "text",
    text: {
      preview_url: false,
      body: message,
    },
  });

module.exports = {
  sendMessage,
};
