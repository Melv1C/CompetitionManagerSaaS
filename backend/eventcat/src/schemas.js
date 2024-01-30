const mongoose = require("mongoose");
const { Schema } = mongoose;

const categorySchema = new Schema({
    id:{
        type: String,
        required: true,
        unique: true,
    },
    categoryId: {
        type: String,
        required: true,
        unique: true,
    },
    nationalCode: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
    abbr: {
        type: String,
        required: true,
        unique: true,
    },
    requiredGender: {
        type: String,
        required: true,
    },
    requiredMinAge: {
        type: Number,
        required: true,
    },
    requiredMaxAge: {
        type: Number,
        required: true,
    },
});
const Category = mongoose.model("category", categorySchema);

const groupingSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    events:{
        type: Array,
        required: true,
    }
});
const Grouping = mongoose.model("grouping", groupingSchema);

const eventSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    validCat: {
        type: Array,
        required: true,
    }
});
const Event = mongoose.model("event", eventSchema);

module.exports = { Category , Grouping , Event };