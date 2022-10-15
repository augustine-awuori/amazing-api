const { imageMapper } = require("../mappers/images");

const mapReply = (reply) => imageMapper(reply);

const mapReplies = (replies) => replies.map(mapReply);

module.exports = { mapReplies, mapReply };
