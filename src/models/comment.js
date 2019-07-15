const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    from : {
        type :String,
        required : true,
        trim : true
    },
    content :{
        type :String,
        required : true
    },
    post : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'Post'
    }
},{
    timestamps : true
})

const Comment = mongoose.model('Comment',commentSchema);

module.exports = Comment;


