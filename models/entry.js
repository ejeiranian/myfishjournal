var mongoose = require("mongoose");

var entrySchema = new mongoose.Schema({
    title: String,
    date: String,
    flyType: String,
    flyBreed: String,
    location: String,
    image: String,
    description: String
});

module.exports = mongoose.model("Entry",entrySchema);