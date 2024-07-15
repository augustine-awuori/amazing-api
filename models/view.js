const mongoose = require("mongoose");

const View = mongoose.model('View', new mongoose.Schema({
    viewer: { type: mongoose.Types.ObjectId, ref: "User" },
    timestamp: {
        type: Number,
        default: function () {
            return this._id.getTimestamp();
        },
    },
}));

module.exports = { View };
