const jwt = require("jsonwebtoken")


exports.userProtected = (req, res, next) => {
    const { user } = req.cookies
    console.log("on protected",user);
    
    if (!user) {
        return res.status(401).json({ message: "Session Expired" })
    }
    jwt.verify(user, process.env.JWT_KEY, (err, decode) => {
        if (err) {
            console.log(err)
            return res.status(406).json({ message: "JWT Error", error: err.message })
        }
        req.loggedInUser = decode.userId
        next()
   })
}
