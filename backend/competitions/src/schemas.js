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
    date: {
        type: Date,
    },
    club: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    paid: {
        type: Boolean,
        required: true,
    },
    freeClub: {
        type: Boolean,
        required: true,
    },
    schedule: {
        type: String,
    },
    description: {
        type: String,
    },
    open: {
        type: Boolean,
        required: true,
        default: false,
    },
    events: {
        type: Array,
        required: true,
    },
    adminId: {
        type: String,
        required: true,
    },
});
const Competition = mongoose.model("competitions", competitionSchema);


module.exports = { Competition };