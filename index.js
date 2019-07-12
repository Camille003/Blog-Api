

const express = require("express");
const bodyParser = require('body-parser');


//Routes Section
const mongoose = require("./db/mongoose");
const userRoutes = require("./routes/user")
const postRoutes = require("./routes/post")
const categoryRoutes = require("./routes/category")
const messageRoutes = require("./routes/message");
const commentsRoutes = require("./routes/comment");
const searchRoutes = require("./routes/search");

// const dotenv  = require("dotenv")
// dotenv.config();

//const {port,jwtSecret,connectionString} = require("./config/config")



const app = express();
const port = process.env.PORT

app.use((error ,req,res,next)=>{
    return res.status(500).json({
        message : error.message
    })
})

app.use(bodyParser.json());
app.use("/users",userRoutes);
app.use("/posts",postRoutes);
app.use("/categories",categoryRoutes);
app.use("/messages",messageRoutes);
app.use("/comments",commentsRoutes);
app.use(searchRoutes)


mongoose.then(() => {
    app.listen(port,()=>{
        console.log("Hello on port "+ port);
    }) 

}).catch((err) => {
   console.log(err)
});

