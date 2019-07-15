const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema({
    title : {
         type : String,
         required: true,
    },
    content : {
        type : String,
        required: true,
    },

    pictures:[
        {
            name : {
                type : String,
                 minLength : 5
            },
            data : {
                type : Buffer
            }
        }
    ],
    tags:[
       {
         tag :{
            type : String,
            required: true,
            trim : true,
            lowercase : true  ,
            required:true,
         }
       }
    ],

    author:{
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'User'
    },

    category : {
        type : mongoose.Schema.Types.ObjectId,
        required:true,
        ref : 'Category'
    },
},{
    timestamps : true,
    toJSON: { virtuals: true }
})


postSchema.virtual('comments',{
    ref : 'Comment',
    localField : '_id',
    foreignField : 'post'
})

postSchema.virtual('numberOfComments',{
    ref : 'Comment',
    localField : '_id',
    foreignField : 'post',
    count : true
})

const Post = mongoose.model('Post',postSchema);

module.exports = Post;