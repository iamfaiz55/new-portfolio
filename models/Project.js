const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    shortDesc: { type: String, required: true },
    desc: { type: String, required: true },
    duration: { type: String, required: true },
    learning: { type: String, required: true },
    hero: { type: String }, 
    screenshots: {
        web: {
            main: { type: String }
        },
        mobile: {
            main: { type: String }
        }
    },

    isMobileApp: { type: Boolean, required: true },
    technologies: {
        frontend: { type: String },
        backend: { type: String },   
        mobile: { type: String },   
        hosting: { type: String },  
        collaboration: { type: String }  
    },
    source: { type: String },  
    live: { type: String },    
}, { timestamps: true });

module.exports = mongoose.model("project", projectSchema);
