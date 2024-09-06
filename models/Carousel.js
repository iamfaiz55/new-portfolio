const mongoose = require("mongoose")

const carouselSchema = new mongoose.Schema({
    image:{type:String},
    desc:{type:String},
},{timestamps:true})

module.exports = mongoose.model("carousel", carouselSchema)