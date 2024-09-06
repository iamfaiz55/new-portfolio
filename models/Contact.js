const mongoose = require("mongoose")

const contactSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true
    },
    message: {
        type:String,
        required:true
    },
    mobile: {
        type:String,
    },
},{timestamps:true})

module.exports = mongoose.model("contact", contactSchema)