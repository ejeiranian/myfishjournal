var mongoose = require("mongoose");

var entrySchema = new mongoose.Schema({
    title: String,
    date: String,
    flyType: String,
    flyBreed: String,
    location: String,
    image: String,
    description: String,
    author:
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            username: String
        }
});

module.exports = mongoose.model("Entry",entrySchema);