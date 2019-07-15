
const Post = require("../models/post");

const {validationResult} = require("express-validator");
const nameOfResource = 'Posts'


exports.createPost = async (req,res,next) =>{
try {
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
    
        const {title,content,category,picture,tags} = req.body;
            
        
        const  post = new Post({
            title,
            content,
            category,
            author : req.user.id
        })


        let tagsArray = tags.split(",");

        tagsArray = tagsArray.map( tag => {
            return tag.trim().toLowerCase();
        })

        for(let tag of tagsArray){
            post.tags.push({tag})
        }

        const postDoc = await post.save()

        if(!postDoc){
            throw new Error("An error Occured");
        }

        return res.status(201).json({
            data : {
                name : "Post",
                resource : postDoc
            },
            message : "Post created Successfully",

        })
    } catch (e) {
        next(e)
    }

}

exports.getAllPost = async (req,res,next) =>{
    try {
        

       //const posts = await Post.find({author:req.user.id});

       /*
        To paginate use the limit and skip options 
        /posts?skip=2&limit=2

        To sort filter by an option
        post?filterOption=filterValue ; 
        post?category=javascript
        post?category=php

        To sort by an option
        post?sortBy=option_desc || post?sortByoption_asc

        match is used to filter by a category

        optioons used to specidy limit ,skip.sort options

       */

       

       const match = {}
       const sort = {}

       if(req.query.category){
           match.category = req.query.category
       }

       if(req.query.sortBy){
           const sortBy = req.query.sortBy.split(":")
           sort[sortBy[0]] = sortBy[1] == 'asc' ? 1 : -1 ;
       }

       await req.user.populate({
           path :'posts',
           match,
           options:{
             skip : parseInt( req.query.skip),
             limit : parseInt(req.query.limit),
             sort
           },
           populate :{path:'comments'}
       }).execPopulate()
       
       const posts = req.user.posts;
       const numberOfPosts = posts.length;

       if(!numberOfPosts){
           return res.status(204).json({
               message : "No Post available",
               data : {
                   name : "Post",
                   resource : posts
               }
           })
       }

       
       return res.status(200).json({
           message : "Posts Available",
           data:{
               name : "Posts",
               resource : posts,
               number : numberOfPosts
           }
       })
    } catch (e) {
        next(e)
    }
}

exports.getUniquePost = async(req,res,next) =>{
    const postId = req.params.id;

    if(!postId){
        return res.status(400).json({
            message : "Invalid Request",
            data:{
               name : "Posts",
               resource : undefined,
               number : undefined
           }
        })
    }
    try {
        const post =  await Post.findOne({_id:postId,author : req.user.id});

       

        if(!post){
            return res.status(404).json({
                message : "No Post found",
                data:{
                    name : "Posts",
                    resource : undefined,
                    number : undefined
                }
            }) 
        }
        // await post.populate("comments").execPopulate();
        // await post.populate("numberOfComments").execPopulate();

        await post.populate({ path: 'comments'}).populate({ path: 'numberOfComments'}).execPopulate();

        return res.status(200).json({
                message : "Post found",
                data:{
                    name : "Posts",
                    resource : post,
                    comments : post.comments,
                    numberOfComments : post.numberOfComments,
                    number : 1
                }
        })
    } catch (e) {
        next(e)
    }

}


exports.updatePost = async (req,res,next) =>{

    
    const postId = req.params.id;
   
     //if no id
    if(!postId){
        return res.status(400).json({
            message : "Invalid Request",
            data:{
               name : "Posts",
               resource : undefined,
               number : undefined
           }
        })
    }
    try {
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
        
        let post =  await Post.findOne({_id:postId,author : req.user.id});

        //if id doesnt belong to a post
        if(!post){
            return res.status(404).json({
                message : "No Post found",
                data:{
                    name : "Posts",
                    resource : undefined,
                    number : undefined
                }
            }) 
        }

        //get the  field we can update
        const allowedUpdates = ['title','content','category'];

        //get fields present in the body of request
        const updatedValues = Object.keys(req.body);
        let validRequest = true;
 
        //if the dont match break from loop and return error message
        for(let value of updatedValues){
            if(!allowedUpdates.includes(value)){
                validRequest = false;
                break;
            }
        }

        if(!validRequest){
            return res.status(400).json({
                message : "Invalid Request",
                data:{
                   name : "Posts",
                   resource : undefined,
                   number : undefined
               }
            })
        }

        //if they match loop through the request body and update as you move
        for(let keys of updatedValues){
            // console.log("Key :"+keys)
            // console.log("Value :"+  req.body[keys]) un comment this line if you ever want to debug
            post[keys] = req.body[keys];
        }
       
        //save the updated post
        const updatedPost = await post.save()

        return res.status(200).json({
                message : "Post Updated",
                data:{
                name : "Posts",
                resource : updatedPost,
                number : 1
            }
        })
    } catch (e) {
        next(e)
    }

}


exports.deletePost = async (req,res,next) =>{
    const postId = req.params.id;

    if(!postId){
        return res.status(400).json({
            message : "Incvalid Request",
            data :{
                name : "Posts",
                resource : undefined,
                number : undefined
            }
        })
    }

    try {
       const post = await Post.findOne({_id:postId,author : req.user.id});

       if(!post){
        return res.status(404).json({
            message : "No Post found",
            data:{
                name : "Posts",
                resource : undefined,
                number : undefined
            }
        }) 
       }

       const deletedPost = await Post.deleteOne({_id : postId});
       return res.status(200).json({
           message:'Post Deleted',
           data : {
               name : 'Post',
               resource : deletedPost,
               number : 1
           }
       })
    } catch (e) {
        next(e)
    }
}

 