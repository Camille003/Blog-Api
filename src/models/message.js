const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const messageSchema = new Schema({
    from : {
        type:String,
        required:true,
        trim : true,
    },
    destination : {
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref : 'User'
    },
    subject : {
        type:String,
        required:true,
        trim : true,
    }
    ,
    content : {
        type:String,
        required:true,
        trim : true,
    },
    status:{
       type : Boolean,
       default : false
    }
})

const Message = mongoose.model('Message',messageSchema)
module.exports = Message;