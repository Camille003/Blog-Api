
const Message = require("../models/message.js");
const nameOFResource = "Message"
const {validationResult} = require("express-validator");


exports.createMessage = async (req,res,next) =>{

    const errors = validationResult(req);
    const errorsArray = errors.array()

    if(!errors.isEmpty()){
        return res.status(400).json({
            message : 'Invalid Formats',
            data : {
                nameOFResource,
                input:{...req.body}
            },
            errors : errorsArray
        })
    }
    const {from,destination,subject,content,status} = req.body;
    
    try {
        const  message = new Message({
            from,destination,subject,content,status
        })

        const messageDoc = await message.save()

        if(!messageDoc){
            throw new Error("An error Occured");
        }
        return res.status(201).json({
            data : {
                nameOFResource,
                resource : messageDoc
            },
            message : "Message created Successfully",

        })
    } catch (e) {
        next(e)
    }

}

exports.getAllMessages = async (req,res,next) =>{
    try {

        //mesages?status=true||false
        //messages?limit=2&skip=2
        //messages?sortBy=createdAt_desc||createdAt_asc
        const match = {};
        let sort = {};

        if(req.query.sortBy){
            const parts = req.query.sortBy.split('_');
            sort[parts[0]] = parts[1] == 'asc' ? 1 : -1 ;
        }

        if(req.query.status){

            const status = req.query.status;
            match.status = status === 'true' ? true : false
        }

        await req.user.populate({
            path : 'messages',
            match ,
            options : {
                limit : parseInt(req.query.limit) ,
                skip : parseInt(req.query.skip),
                sort
            }
        }).populate('numberOfMessages').execPopulate()
        const numberOfMessages = req.user.numberOfMessages
   

       if(!numberOfMessages){
           return res.status(204).json({
               message : "No Messages available",
               data : {
                   nameOFResource,
                   resource : req.user.message
               }
           })
       }

       
       return res.status(200).json({
           message : "Messages Available",
           data:{
            nameOFResource,
               resource : req.user.messages,
               number : numberOfMessages
           }
       })
    } catch (e) {
        next(e)
    }
}

exports.getUniqueMessage = async(req,res,next) =>{
    const mesId = req.params.id;

    if(!mesId){
        return res.status(400).json({
            message : "Invalid Request",
            data:{
                nameOFResource,
               resource : undefined,
               number : undefined
           }
        })
    }
    try {
        const message =  await Message.findOne({_id:mesId,destination : req.user.id});

        if(!message){
            return res.status(404).json({
                message : "No Message found",
                data:{
                    nameOFResource,
                    resource : undefined,
                    number : undefined
                }
            }) 
        }
        return res.status(200).json({
                message : "Message found",
                data:{
                    nameOFResource,
                resource : message,
                number : 1
            }
        })
    } catch (e) {
        next(e)
    }

}



exports.deleteMessage = async (req,res,next) =>{
    const mesId = req.params.id;

    if(!mesId){
        return res.status(400).json({
            message : "Incvalid Request",
            data :{
                nameOFResource,
                resource : undefined,
                number : undefined
            }
        })
    }

    try {
       const message = await Message.findOne({_id : mesId,destination : req.user.id});

       if(!message){
        return res.status(404).json({
            message : "No Message found",
            data:{
                nameOFResource,
                resource : undefined,
                number : undefined
            }
        }) 
       }

       const deletedMessage = message.remove()
       return res.status(200).json({
           message:'Message Deleted',
           data : {
            nameOFResource,
               resource : deletedMessage,
               number : 1
           }
       })
    } catch (e) {
        next(e)
    }
}

 