const asyncHandler = require('express-async-handler');
const Project = require('../models/Project');
const fs = require('fs');
const path = require('path');
const uploadToCloudinary = require('../utils/upload');
const { checkEmpty } = require('../utils/checkEmpty');
const Technology = require('../models/Technology');

exports.addProject = asyncHandler(async (req, res) => {
    const {
        title,
        shortDesc,
        desc,
        duration,
        learning,
   
        sections,
        isMobileApp,
        technologies,
        source,
        live
    } = req.body;

    let heroImageUrl = '';
    let screenshotsUrls = [];

    if (req.files && req.files.length > 0) {
 
            if (req.files.hero) {
                const heroImage = req.files.hero[0];
                const uploadResult = await uploadToCloudinary(heroImage);
                heroImageUrl = uploadResult.secure_url;
                fs.unlinkSync(heroImage.path);
            }

            // Upload screenshots
            if (req.files.screenshots) {
                for (const screenshot of req.files.screenshots) {
                    const uploadResult = await uploadToCloudinary(screenshot);
                    screenshotsUrls.push(uploadResult.secure_url);
                    fs.unlinkSync(screenshot.path);
                }
            }
        
    }

    const newProject = await Project.create({
        title,
        shortDesc,
        desc,
        duration,
        learning,
        hero: heroImageUrl,
        screenshots: screenshotsUrls,
        sections,
        isMobileApp,
        technologies,
        source,
        live
    });

    res.json({ message: "Project created successfully" });
});

exports.addTechnology = asyncHandler(async(req, res)=>{
    const {name, category}=req.body
   const {isError, error}=checkEmpty({name, category})

   if(isError){
     return res.status(400). json({message:"ALL FIELDS REQUIRED", error})
   }
   await Technology.create({name, category})
   res.json({message:"Technology Create Success"})
})
exports.getAllTechnologies = asyncHandler(async(req, res)=>{
    const result = await Technology.find()
    res.json({message:"Technology Get Success", result})
})
exports.updateTechnology = asyncHandler(async(req, res)=>{
   const {id}=req.params
 await Technology.findByIdAndUpdate(id, req.body)
    res.json({message:"Technology Update Success"})
}) 
exports.deleteTechnology = asyncHandler(async(req, res)=>{
    const {id}=req.params
    await Technology.findByIdAndDelete(id)
       res.json({message:"Technology Delete Success"})
})
