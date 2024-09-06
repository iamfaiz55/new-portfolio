const mongoose = require("mongoose")

const adminSChema = new mongoose.Schema({
name: {
    type:String,
    required:true
},
email: {
    type:String,
    required:true
},
password: {
    type:String,
    required:true
},
otp: {
    type:String,
},
},{timestamps:true})

module.exports = mongoose.model("admin", adminSChema)