const axios = require("axios");
const winston = require("winston");

async function sendNotification(orderDetails) {
  const API_KEY = "your_api_key"; // Replace with your WhatsApp Business API key
  const PHONE_NUMBER = "recipient_phone_number"; // Replace with recipient's phone number

  const message = `New order received:\n${orderDetails}`;

  try {
    const response = await axios.post(
      `https://api.twilio.com/2010-04-01/Accounts/${API_KEY}/Messages.json`,
      {
        To: `whatsapp:${PHONE_NUMBER}`,
        From: "whatsapp:your_twilio_phone_number",
        Body: message,
      },
      {
        auth: {
          username: API_KEY,
          password: "your_twilio_auth_token",
        },
      }
    );
  } catch (error) {
    winston.error("Error sending WhatsApp notification:", error);
  }
}
