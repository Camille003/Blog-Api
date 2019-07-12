
const Category = require("../models/category");
const nameOFResource = "Category"
const {validationResult} = require("express-validator")


exports.createCategory = async (req,res,next) =>{
   

    const {title,description,creator,tags} = req.body;
    
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

        const  category = new Category({
            title,
            description,
            creator
        })
        

        let tagsArray = tags.split(",");

        tagsArray = tagsArray.map( tag => {
            return tag.trim().toLowerCase();
        })

        for(let tag of tagsArray){
            category.tags.push({tag})
        }

        const categoryDoc = await category.save()
       
        if(!categoryDoc){
            throw new Error("An error Occured");
        }
        return res.status(201).json({
            data : {
                nameOFResource,
                resource : categoryDoc
            },
            message : "Category created Successfully",

        })
    } catch (e) {
        next(e)
    }

}

exports.getAllCategories = async (req,res,next) =>{
    try {

       const categories = await Category.find({creator : req.user.id});
       const numberOfCategories = categories.length;

       if(!numberOfCategories){
           return res.status(204).json({
               message : "No Categories available",
               data : {
                   nameOFResource,
                   resource : categories
               }
           })
       }

       
       return res.status(200).json({
           message : "Catgeories Available",
           data:{
            nameOFResource,
               resource : categories,
               number : numberOfCategories
           }
       })
    } catch (e) {
        next(e)
    }
}

exports.getUniqueCategory = async(req,res,next) =>{
    const catId = req.params.id;

    if(!catId){
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
        const category =  await Category.findById({_id : catId , creator:req.user.id});

        if(!category){
            return res.status(404).json({
                message : "No Category found",
                data:{
                    nameOFResource,
                    resource : undefined,
                    number : undefined
                }
            }) 
        }

       await  category.populate('numberOfPosts').execPopulate()
        return res.status(200).json({
                message : "Category found",
                data:{
                    nameOFResource,
                    resource : category,
                    number : 1
                },
                statistics:{
                    posts : category.numberOfPosts
                }
        })
    } catch (e) {
        next(e)
    }

}


exports.updateCategory = async (req,res,next) =>{
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
    const catId = req.params.id;
   
     //if no id
    if(!catId){
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
        let category =  await Category.findById({_id : catId , creator:req.user.id});

        //if id doesnt belong to a post
        
        if(!category){
            return res.status(404).json({
                message : "No Category found",
                data:{
                    nameOFResource,
                    resource : undefined,
                    number : undefined
                }
            }) 
        }

        //get the  field we can update
        const allowedUpdates = ['title','description'];

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
                    nameOFResource,
                   resource : undefined,
                   number : undefined
               }
            })
        }

        //if they match loop through the request body and update as you move
        for(let keys of updatedValues){
            console.log("Key :"+keys)
            console.log("Value :"+  req.body[keys])
            category[keys] = req.body[keys];
        }
       
        //save the updated post
        const updatedCategory = await category.save()

        return res.status(200).json({
                message : "Category Updated",
                data:{
                    nameOFResource,
                resource : updatedCategory,
                number : 1
            }
        })
    } catch (e) {
        next(e)
    }

}


exports.deleteCategory = async (req,res,next) =>{
    const catId = req.params.id;

    if(!catId){
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
       const category = await Category.findOne({_id : catId,creator : req.user.id});

       if(!category){
        return res.status(404).json({
            message : "No Category found",
            data:{
                nameOFResource,
                resource : undefined,
                number : undefined
            }
        }) 
       }

       await category.remove();
       return res.status(200).json({
           message:'Category Deleted',
       })
    } catch (e) {
        next(e)
    }
}

 