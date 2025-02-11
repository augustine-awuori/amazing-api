const Joi = require("joi");
const mongoose = require("mongoose");

module.exports.Report = mongoose.model(
    "Report",
    new mongoose.Schema({
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            maxlength: 255,
        },
        issueType: {
            type: String,
            enum: ["Bug", "Payment Issue", "Account Issue", "Other"],
            required: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000,
        },
        seen: {
            type: Boolean,
            default: false,
        },
        timestamp: {
            type: Number,
            default: function () {
                return this._id.getTimestamp();
            },
        },
    })
);

module.exports.validateReport = (report) =>
    Joi.object({
        name: Joi.string().max(100).required(),
        email: Joi.string().email().max(255).required(),
        issueType: Joi.string()
            .valid("Bug", "Payment Issue", "Account Issue", "Other")
            .required(),
        description: Joi.string().max(1000).required(),
    }).validate(report);
