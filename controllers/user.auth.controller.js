const asyncHandler = require("express-async-handler")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const validator = require("validator")
const { checkEmpty } = require("../utils/checkEmpty")
const User = require("../models/User")
const sendEmail = require("../utils/email")
require("dotenv").config({path:""})



exports.registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body
    const { isError, error } = checkEmpty({ name, email, password })
    if (isError) {
        return res.status(400).json({ message: "All Feilds Required", error })
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid Email" })
    }
    const isFound = await User.findOne({ email })
    if (isFound) {
        return res.status(400).json({ message: "email already registered with us" })
    }
    const hash = await bcrypt.hash(password, 10)
    await User.create({ name, email, password: hash })

    res.json({ message: "Register Success" })
})

exports.loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    const { isError, error } = checkEmpty({ email, password })
    if (isError) {
        return res.status(401).json({ message: "All Fields required", error })
    }
    if (!validator.isEmail(email)) {
        return res.status(401).json({ message: "Invalid Email" })
    }
    const result = await User.findOne({ email })

    if (!result) {
        return res.status(401).json({ message:"Invalid Email"  })
    }
    const isVerify = await bcrypt.compare(password, result.password)

    if (!isVerify) {
        return res.status(401).json({ message:"Invalid Password"  })
    }

    // send OTP
    const otp = Math.floor(10000 + Math.random() * 900000)

    await User.findByIdAndUpdate(result._id, { otp })

    await sendEmail({
        to: email,
        subject: `Login OTP`,
        message: `
            <h1>Do Not Share Your Account OTP</h1>
            <p>your login otp ${otp}</p>
        ` })

    res.json({ message: "Credentials Verify Success. OTP send to your registered email.", result:{
        email
    } })
})

exports.verifyOTP = asyncHandler(async (req, res) => {
    const { otp, email } = req.body
    const { isError, error } = checkEmpty({ email, otp })
    if (isError) {
        return res.status(401).json({ message: "All Fields required", error })
    }
    if (!validator.isEmail(email)) {
        return res.status(401).json({ message: "Invalid Email" })
    }
    

    const result = await User.findOne({ email })
// console.log(result);

    if (!result) {
        return res.status(401).json({ message: "Invalid Credentials" })
    }

    if (otp != result.otp) {
        return res.status(401).json({ message: "Invalid OTP" })
    }
    const token = jwt.sign({ userId: result._id }, process.env.JWT_KEY, { expiresIn: "1d" })
console.log("generate token", token);

    res.cookie("user", token, {
        maxAge: 86400000,
        httpOnly: true,    
   
    });
    
    res.json({
        message: "OTP Verify Success.", result: {
            _id: result._id,
            name: result.name,
            email: result.email
        }
    })
})

exports.logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie("user")
    res.json({ message: "Admin Logout Success" })
})

