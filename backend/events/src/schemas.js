const mongoose = require("mongoose");
const { Schema } = mongoose;

const eventSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    validCat: {
        type: Array,
        required: true,
    },
    abbr:{
        type: String,
        required: true,
    },
    grouping: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
});
const Event = mongoose.model("event", eventSchema);

module.exports = { Event };