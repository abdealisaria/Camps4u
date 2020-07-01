var mongoose = require("mongoose");
var usermodel = require("../models/user");

var commentSchema = new mongoose.Schema({
    text: String,
    createdAt: { type: Date, default: Date.now },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: usermodel
        },
        username: String
    }
});

module.exports = mongoose.model("comment", commentSchema);