const mongoose = require("mongoose")

const socialSchema = new mongoose.Schema({
    image:{type:String},
    desc:{type:String},
},{timestamps:true})

module.exports = mongoose.model("socialLink", socialSchema)