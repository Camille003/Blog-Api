const mongoose = require("mongoose");
const bcrypt   = require("bcrypt");
const jwt      = require("jsonwebtoken");

const Post     = require("./post");
const Category = require("./category")
const Message  =require("./message");
// const dotenv = require('dotenv');
// dotenv.config();
//const {jwtSecret} = require("../config/config")

const Schema = mongoose.Schema;


const userSchema = new Schema({
    name : {
        type : String,
        required : true,
        trim : true,
        minlength : 4,
        maxlength : 25
    },
    avatar :{
        type : Buffer
    }
    ,
    email : {
        type:String,
        required :true,
        trim : true,
    },
    password : {
        type:String,
        required :true, 
    },
    age : {
        type: Number,
        min : 15,
        max : 100,
    },
    tokens:[
       {
          token:{
              type : String,
              required : true,
          }
       } 
    ]
},{
    timestamps : true
})

userSchema.virtual('posts',{
    ref : 'Post',
    localField : '_id',
    foreignField : 'author',
})
userSchema.virtual('numberOfPosts',{
    ref : 'Post',
    localField : '_id',
    foreignField : 'author',
    count : true
})

userSchema.virtual('categories',{
    ref : 'Category',
    localField : '_id',
    foreignField : 'creator'
})
userSchema.virtual('numberOfCategories',{
    ref : 'Category',
    localField : '_id',
    foreignField : 'creator',
    count : true

})

userSchema.virtual('messages',{
    ref : 'Message',
    localField : '_id',
    foreignField : 'destination',
  
})
userSchema.virtual('numberOfMessages',{
    ref : 'Message',
    localField : '_id',
    foreignField : 'destination',
    count : true
  
})

userSchema.pre('remove',async function(next){
    const user = this;
    await  Post.deleteMany({author : user.id});
    await  Category.deleteMany({creator : user.id});
    await Message.deleteMany({destination : user.id})
    next()
})
userSchema.methods.hashPassword = async function(plainPassword){
    const user = this;
    user.password = await bcrypt.hash(plainPassword,8);
    return true 
}

userSchema.methods.generateTokens = async function(){
    const user  = this;
    const token = jwt.sign({_id : user.id},process.env.JWT_SECRET_TEST)

    user.tokens.push({
        token
    });

    await user.save();
    return token;
}

userSchema.methods.toJSON = function(){
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar


    return userObject
}



const User = mongoose.model('User',userSchema);
module.exports = User;


