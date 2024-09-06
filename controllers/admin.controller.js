const asyncHandler = require('express-async-handler');
const Project = require('../models/Project');
const fs = require('fs');
const path = require('path');
const uploadToCloudinary = require('../utils/upload');
const { checkEmpty } = require('../utils/checkEmpty');
const Technology = require('../models/Technology');
const Social = require('../models/Social');
const Carousel = require('../models/Carousel');
const upload = require('../utils/upload');

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


exports.addSocial = asyncHandler(async(req, res)=>{
    const {name, link}=req.body
   const {isError, error}=checkEmpty({name, link})

   if(isError){
     return res.status(400). json({message:"ALL FIELDS REQUIRED", error})
   }
   await Social.create({name, link})
   res.json({message:"Social Create Success"})
})
exports.getAllSocial = asyncHandler(async(req, res)=>{
    const result = await Social.find()
    res.json({message:"Social Get Success", result})
})
exports.updateSocial = asyncHandler(async(req, res)=>{
   const {sid}=req.params
 await Social.findByIdAndUpdate(sid, req.body)
    res.json({message:"Social Update Success"})
}) 
exports.deletesocial = asyncHandler(async(req, res)=>{
    const {sid}=req.params
    await Social.findByIdAndDelete(sid)
       res.json({message:"Social Delete Success"})
})




exports.addCarousel = asyncHandler(async (req, res) => {

    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: "Error in uploading file" });
        }

        const { desc } = req.body;

        const { isError, error } = checkEmpty({ desc });
        if (isError) {
            return res.status(400).json({ message: "ALL FIELDS REQUIRED", error });
        }

      
        if (!req.files[0]) {
            return res.status(400).json({ message: "No image file provided" });
        }

     
            const {secure_url} = await uploadToCloudinary.uploader.upload(req.files[0].path, {
                folder: "carousel",
            });

         
            await Carousel.create({image: secure_url, desc});

            res.status(201).json({message: "Carousel created successfully",});
      
    });
});
exports.getAllCarousel = asyncHandler(async(req, res)=>{
    const result = await Carousel.find()
    res.json({message:"Carousels Get Success", result})
})
exports.updateCarousel = asyncHandler(async (req, res) => {
    const { cId } = req.params;

    upload(req, res, async (err) => {
        let img
        if (err) {
            return res.status(400).json({ message: "Error in uploading file" });
        }
            if (req.file) {
                const currentCarousel = await Carousel.findById(cId);
                if (!currentCarousel) {
                    return res.status(404).json({ message: "Carousel not found" });
                }

                const imagePublicId = currentCarousel.image.split("/").pop().split(".")[0];
                await uploadToCloudinary.uploader.destroy(`carousel/${imagePublicId}`);

                const {secure_url} = await uploadToCloudinary.uploader.upload(req.files[0].path, {
                    folder: "carousel",
                });
                img = secure_url
            }
            await Carousel.findByIdAndUpdate(cId, {...req.body, desc:req.body.desc, image:img});
            res.status(200).json({message: "Carousel updated successfully"});
    
    });
});
exports.deleteCarousel = asyncHandler(async(req, res)=>{
    const {cid}=req.params
   const result = await Carousel.findById(cid)

    const imagePublicId = result.image.split("/").pop().split(".")[0];
    await uploadToCloudinary.uploader.destroy(`carousel/${imagePublicId}`);

    await Social.findByIdAndDelete(sid)
       res.json({message:"Social Delete Success"})
})
