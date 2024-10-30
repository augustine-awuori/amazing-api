const { Type } = require("../models/type");

module.exports = (typeId) => Type.findById(typeId);
