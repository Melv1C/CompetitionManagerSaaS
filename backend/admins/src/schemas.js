const mongoose = require("mongoose");
const { Schema } = mongoose;

const AdminSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    club: {
        type: String,
        required: true,
    },
    allAccess: {
        type: Boolean,
        required: true,
    }
});
const Admin = mongoose.model("admin", AdminSchema);


module.exports = { Admin };