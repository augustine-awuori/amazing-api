const { User } = require("../models/user");

function getAuthCode() {
    return Math.floor(1000 + Math.random() * 9000);
}

async function findUniqueUsername(name) {
    let username = generateUsername(name);
    let found = await User.findOne({ username });

    while (found) {
        const randomNumber = generateRandomNumber();
        username = `${generateUsername(name)}${randomNumber}`;
        found = await User.findOne({ username });
    }

    return username;
}

function generateUsername(name) {
    return name.replace(/\s+/g, '').toLowerCase();
}

function generateRandomNumber() {
    return Math.floor(Math.random() * 900) + 100;
}

module.exports = { findUniqueUsername, getAuthCode }