const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser= require("cookie-parser");
const path = require("path");
const { userProtected } = require("./middlewares/userProtected");
require("dotenv").config({ path: "./.env" });

mongoose.connect(process.env.MONGO_URL);
const app = express();
app.use(cookieParser());
app.use(express.static("dist"));
app.use(express.json());
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}));


app.use("/api/auth", require("./routers/auth.routes"));
app.use("/api/admin",userProtected, require("./routers/admin.routes"));

app.use("*", (req, res) => {
  // res.status(404).json({ message: "Resource Not Found" });
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message || "something went wrong" });
  // res.sendFile(path.join(__dirname, "dist", "index.html"));
});

mongoose.connection.once("open", () => {
  console.log("MONGO CONNECTED");
  app.listen(process.env.PORT, console.log("SERVER RUNNING"));
});
