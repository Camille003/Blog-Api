const express = require("express");
const {check} = require("express-validator");
const multer = require("multer")
const sharp = require("sharp")


const userController = require("../controllers/user")
const isAuth = require("../middleware/isAuth")

const router = express.Router();

router.get("/me",isAuth,userController.getProfile)



router.post("/signUp",
[
    check("name").trim().isAlpha().isLength({min:4,max:25}),
    check("email").isEmail().normalizeEmail().trim(),
    check("password").isString().isLength({min:5}),
    check("age").isInt({min : 5,max : 100}).trim()
],
userController.signUp);



router.post("/login",
[
    check("password","Invalid Credentials").isString().isLength({min:4,max:25}).trim(),
    check("email","Invalid Credentials").isEmail().normalizeEmail().trim(),
],
userController.login)

router.post("/logout",isAuth,userController.logout)





const upload = multer({
   // dest:"avatars",
    limits:{
       fileSize : 1000000 //1M = 1million kilobytes
    },
    fileFilter (req,file,cb){
        const allowedUploads = ['jpg','jpeg','png'];
        const extension = file.originalname.split(".")[1];

        if(!allowedUploads.includes(extension)){
            return cb(new Error("Please upload the right format"));
        }
        return cb(null, true);
    }
})

router.post("/me/avatar",isAuth,upload.single("avatar"), async(req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    req.user.avatar = buffer;
    //req.user.avatar = req.file.buffer;
    await req.user.save()
    return res.status(201).send({
       message : "Uploaded Successfuly"
    })
}
,(error ,req,res,next)=>{
    return res.status(400).json({
        error : error.message
    })
});


router.delete('/me/avatar',isAuth,userController.deleteProfilePic)
router.delete("/me",isAuth,userController.deleteAcount)

router.get('/:id/avatar',userController.getImage)

module.exports = router