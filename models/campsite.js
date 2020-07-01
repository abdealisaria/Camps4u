var mongoose = require("mongoose");
var commentmodel = require("./comment");
var usermodel = require("./user");
var camps4uschema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    desc: String,
    location: String,
    createdAt: { type: Date, default: Date.now },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: usermodel
        }, username: String
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: commentmodel
    }]
});

module.exports = mongoose.model("camp", camps4uschema);