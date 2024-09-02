const { isValidObjectId } = require("mongoose");

const { Service } = require("../models/service");

const populateAndProject = (query) => query.populate("author", "-password");

const findById = async (id) => {
    if (!isValidObjectId(id)) return;

    return await populateAndProject(Service.findById(id));
};

const findAll = async () => {
    const services = await populateAndProject(Service.find({}).sort("-_id"));

    return services;
};

module.exports = { findAll, findById };
