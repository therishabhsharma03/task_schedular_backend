const mongoose = require("mongoose");
const express = require("express");
const homepage = require("./controller/homepage");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoute = require("./controller/userRoute");
const completedTaskRoute = require("./controller/completedTaskRoute")

const app = express();



mongoose.set("strictQuery" , true);
mongoose.connect("mongodb+srv://task:task12345@cluster0.m0tvowo.mongodb.net/test");
var db = mongoose.connection;
db.on("open",()=>console.log("Connected to DB"));
db.on("error",()=>console.log("Error occurred"));



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

app.use("/auth",userRoute);
app.use("/homepage",homepage);
app.use("/completedTaskRoute", completedTaskRoute);
app.listen(4000,()=>{
    console.log("Server connected at 4000");
})
