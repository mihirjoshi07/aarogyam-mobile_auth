const express = require("express")
const app=express()
require('dotenv').config()
const userRoutes=require("./routes/auth.js")
const mongoUri = process.env.DB_URI;
const mongoose=require("mongoose")
app.use(express.json())
app.use("/auth",userRoutes)


mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("MongoDB connection error:", err));





app.listen(process.env.PORT,()=>{
    console.log(`App is running on PORT ${process.env.PORT}`)
})