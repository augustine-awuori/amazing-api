const Joi = require("joi");
const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    author: { type: mongoose.Types.ObjectId, ref: "User" },
    description: {
        maxlength: 200,
        trim: true,
        type: String,
    },
    name: {
        maxlength: 50,
        minlength: 2,
        required: true,
        trim: true,
        type: String,
    },
    price: { max: 1_000_000, min: 1, required: true, type: Number },
    images: [String]
});

const Service = mongoose.model('Service', schema);

const validate = (service) => Joi.object({
    description: Joi.string().max(200).allow(""),
    name: Joi.string().required().min(2).max(50),
    price: Joi.number().required().min(1).max(1_000_000),
    images: Joi.array().min(1).max(5),
}).validate(service);

module.exports.schema = schema;
module.exports.Service = Service;
module.exports.validate = validate;
