//require dependencies
const jwt  = require("jsonwebtoken")
const User = require("../models/user");
const {jwtSecret} = require("../config/config")



const auth = async (req,res,next) =>{
   try {
    //get data from the header
    const header = req.header("Authorization")
    const token = header.split(" ")[1];

    //decode token from the info
    const decodedTOken = jwt.verify(token,jwtSecret);

    //verify if there is a user with that token and that id
    const user = await User.findOne({_id : decodedTOken._id , 'tokens.token':token})

    //if user does not exist return json data
    if(!user){
        return res.status(401).json({
            message : 'Please Authenticate Yourself',
            data : {
                nameOfResource : 'User',
                resource : undefined,
                number : undefined
            }
        })
    }

    //add token to req
    req.token = token;

    //add user to req
    req.user = user

    //next
    return next()
   } catch (e) {
     next(e);
   }
}

module.exports = auth;

