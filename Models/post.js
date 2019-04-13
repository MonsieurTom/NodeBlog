var mongoose = require("mongoose");

/* post Schema for mongoDB (mongoose) */
let postSchema = new mongoose.Schema({
    title:  String,
    author: String,
    body:   String,
    date: { type: Date, default: Date.now }
});

/* Allow to require the schema from my index.js */
module.exports = mongoose.model('Post', postSchema);
