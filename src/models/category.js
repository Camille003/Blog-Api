const mongoose = require("mongoose");
const Post = require("./post");

const Schema = mongoose.Schema;

const categorySchema = new Schema({
    title : {
        type : String,
        minlength : 5,
        maxlength:25,
        trim:true,
        required : true,
    },
    description : {
        type : String,
        minlength : 5,
        maxlength:50,
        trim:true,
        required : true,
    },
    tags:[
        {
            tag :{
                type : String,
                required:true,
                trim : true,
                lowercase : true
            }
        }
    ],
    creator : {
        required : true,
        ref : 'User',
        type : mongoose.Schema.Types.ObjectId
    },
    date : {
        type : Date,
        default:Date.now,
    }
},{
    timestamps : true
})

categorySchema.virtual('posts',{
    ref : 'Post',
    localField : '_id',
    foreignField : 'category'
})
categorySchema.virtual('numberOfPosts',{
    ref : 'Post',
    localField : '_id',
    foreignField : 'category',
    count : true
})

categorySchema.pre('remove', async function(next){
    const category = this;
    await Post.deleteMany({category : category.id});
    next()
})
const Category = mongoose.model('Category',categorySchema);

module.exports = Category;