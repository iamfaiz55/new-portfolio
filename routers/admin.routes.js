const adminController = require("../controllers/admin.controller")

const route = require("express").Router()

route
    .post("/create-project", adminController.addProject )
    // .post("/create-project", adminController.addProject )
    .post("/add-technology", adminController.addTechnology)
    .get("/get-technologies", adminController.getAllTechnologies)
    .put("/update-technology/:id", adminController.updateTechnology)
    .delete("/delete-technology/:id", adminController.deleteTechnology)


    .post("/add-social", adminController.addSocial)
    .get("/get-social", adminController.getAllSocial)
    .put("/update-social/:sid", adminController.updateSocial)
    .delete("/delete-social/:sid", adminController.deletesocial)

module.exports = route