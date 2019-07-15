const express = require("express");
const {check} = require("express-validator");
const sharp  = require("sharp");
const multer = require("multer")

const postControllers = require("../controllers/post");
const isAuth = require("../middleware/isAuth");

const router = express.Router();


//Get all posts
router.get("/",isAuth,postControllers.getAllPost);

//Get a Unique
router.get("/:id",isAuth,postControllers.getUniquePost);

const postUpload = multer({
    limits:{
        fileSize : 5000000
    },
    fileFilter(req,file,cb){
        const allowedUploads = ['jpeg','jpg','png','gif'];
        const fileExtension = file.originalname.split(".")[1];

        if(!allowedUploads.includes(fileExtension)){
            return cb(new Error("Upload the appropriate Format Please"));
        }

        return cb(null,true)
    }
}) 
//Create A Post
router.post("/",
isAuth,
[
    check("title","Title should be at least 5 characters long").isString().isLength({min:5}).trim(),
    check("content","Content should be at least 5 characters long").isString().isLength({min:5}).trim(),
    check("tags","Tags must be includes").isString().isLength({min:1}).trim()
],
postUpload.single('post')
,
postControllers.createPost,(err,req,res,next)=>{
    return res.status(400).json({
        error : err.message
    })
});

//Update a Post
router.patch("/:id",
isAuth,
[
    check("title","Title should be at least 5 characters long").isString().isLength({min:5}).trim(),
    check("content","Content should be at least 5 characters long").isString().isLength({min:5}).trim(),
],
postControllers.updatePost);

//Delete a Post
router.delete("/:id",isAuth,postControllers.deletePost)

module.exports = router;


