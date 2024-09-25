const Joi = require("joi");
const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    userId: String,
    text: {
        trim: true,
        type: String,
    },
    timestamp: {
        type: Number,
        default: function () {
            return this._id.getTimestamp();
        },
    },
});

const Query = mongoose.model("Query", schema);

const validate = (query) =>
    Joi.object({
        userId: Joi.string().allow(""),
        text: Joi.string().required(),
    }).validate(query);

exports.Query = Query;
exports.validate = validate;
exports.schema = schema;
