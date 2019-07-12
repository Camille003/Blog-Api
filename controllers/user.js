const User = require("../models/user");
// const Post = require("../models/post");
const bcrypt = require("bcrypt");
const nameOfResource = "User"
const {validationResult} = require("express-validator")




exports.signUp = async (req,res,next) =>{
    

   try{
    const errors = validationResult(req);
    const errorsArray = errors.array()

    if(!errors.isEmpty()){
        return res.status(400).json({
            message : 'Invalid Formats',
            data : {
                nameOfResource,
                input:{...req.body}
            },
            errors : errorsArray
        })
    }

    const {name,email,password} = req.body;
    const user = new User({
        name,email
    });

        await user.hashPassword(password);

        const userDoc = await user.save();

        if(!userDoc){
            throw new Error("Server side error")
        }

        return res.status(201).json({
            message : "User Created",
            data : {
                nameOfResource,
                resource : userDoc,
                number : 1
            }
        })
   }
   catch(e){
    next(e)
   }  

}

exports.login = async (req,res,next)=>{
   
   

   try{

    const errors = validationResult(req);
    const errorsArray = errors.array()

    if(!errors.isEmpty()){
        return res.status(400).json({
            message : 'Invalid Formats',
            data : {
                nameOfResource,
                input:{...req.body}
            },
            errors : errorsArray
        })
    }

    const {email , password} = req.body;

    const user = await User.findOne({email});

    if(!user){
        return res.status(404).json({
            message : "User not found",
            data : {
                nameOfResource,
                resource : undefined,
                number : undefined
            }
        })
    }

    const isPassword = await bcrypt.compare(password,user.password);

    if(!isPassword){
        return res.status(404).json({
            message : "User not found",
            data : {
                nameOfResource,
                resource : undefined,
                number : undefined
            }
        })
    }

    const token =  await user.generateTokens()

    return res.json({
        message : "User Logged In",
        data:{
            nameOfResource,
            resource : user,
            number:1
        },
        token
    })
   }catch(e){
    next(e)
   }


}

exports.getProfile = async (req,res,next) =>{
    try {
    
      const  id   = req.user.id
      const  user = await User.findById(id);

      await user.populate('numberOfPosts').populate('numberOfCategories').populate('numberOfMessages').execPopulate()
     
   

      return res.status(200).json({
        message : "Profile found",
        data:{
          nameOfResource,
          user,
          number : 1,
        },
        statistics : {
           posts : user.numberOfPosts,
           categories : user.numberOfCategories,
           messages : user.numberOfMessages
        }
      })
    } catch (e) {
        next(e)
    }
}

exports.logout = async (req,res,next) =>{
    try{
        console.log(req.user);
        req.user.tokens = req.user.tokens.filter(token =>{
            return token.token !== req.token
        })

        await req.user.save()

        return res.status(200).json({
           message : "User Logged Out"
        })

    }catch(error){
        next(e)
    }
}

exports.deleteAcount = async (req,res,next) =>{
   try {
      
    //    const deletedPosts = await  Post.deleteMany({author : req.user.id});


    //     if(!deletedPosts){
    //         throw new Error("An error Occured")
    //     }
    //     console.log(deletedPosts);

    //     const deletedDoc = await User.deleteOne({_id : req.user.id});


    //     if(!deletedDoc){
    //         throw new Error("An error Occured")
    //     }
    //     console.log(deletedDoc)

        await req.user.remove()
        return res.status(200).json({
            message : "Account Delete",
        })

   } catch (e) {
    next(e)
   }
}

exports.getImage = async (req,res,next)=>{
    try {
       const user = await User.findById(req.params.id);

       if(!user || !user.avatar){
           return res.status(404).json({
               message : "Profile Picture not found for photot"
           })
       }
       res.set('Content-Type' ,'image/png')
       res.send(user.avatar);
    } catch (e) {
      return next(e)
    }
}

exports.deleteProfilePic = async (req,res,next) =>{
    try {
       req.user.avatar = undefined,
       await req.user.save;

       return res.status(200).json({
           message:"Profile Picture Deleted",
           data :{
               nameOfResource,
               user : req.user,
               number : 1
           }
       })
    } catch (e) {
       return next(e)
    }
}