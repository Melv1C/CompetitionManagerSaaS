const mongoose = require("mongoose");
const { Schema } = mongoose;

const competitionSchema = new Schema({
    id:{
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    club: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
    },
});
const Competition = mongoose.model("user", competitionSchema);


module.exports = { Competition };