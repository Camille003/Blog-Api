
const Comment = require("../models/comment");
const Post    = require("../models/post");

exports.createComment = async (req,res,next) =>{

    const {from,postId,content} = req.body
    try {

       const post = await Post.findById(postId);
       if(!post){
           return res.status(400).json({
               message : "No Post found"
           })
       }

       const comment = new Comment({
          from ,
          content,
          post : post.id
       })

       await comment.save();
       await comment.populate('post').execPopulate()
       return res.status(201).json({
            message : "Comment Added",
            data:{
                comment,
                post : comment.post.title
            }
            
       })
    } catch (e) {
       next(e)
    }

}

