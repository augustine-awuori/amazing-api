const getWhatsAppNumberFromUser = (user) => user.otherAccounts?.whatsapp || "";

const appBaseURL = "https://kisiiuniversemart.digital";

module.exports = { appBaseURL, getWhatsAppNumberFromUser };
