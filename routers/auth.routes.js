const router = require("express").Router()
// const auth = require("")
const auth = require("../controllers/user.auth.controller")

router
    .post("/register", auth.registerUser )
    .post("/login", auth.loginUser )
    .post("/verify-otp", auth.verifyOTP )
    .post("/logout", auth.logoutUser )

module.exports = router