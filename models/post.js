const Joi = require('joi');
const mongoose = require('mongoose');

const schema = new mongoose.Schema({});

const Post = mongoose.model('Post', schema);

const validatePost = post => Joi.object({}).validate(post);

module.exports.Post = Post;
module.exports.validate = validatePost;
module.exports.postSchema = schema;
