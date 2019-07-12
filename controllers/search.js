const Post = require("../models/post");
const Category = require("../models/category");

const search = async (req,res,next)=>{
     
    try{
      
        let {searchTag , searchBy} = req.body;
        searchTag = searchTag.trim();


        if(searchBy === 'Post'){

            const posts = await Post.find({'tags.tag' : searchTag})

            if(!posts.length){
                return res.status(204).json({
                   message : "No Post found"
                })
            }


            return res.status(200).json({
                message : 'Post found',
                data:{
                    nameOfResource : 'Post',
                    posts,
                    number : posts.length
                }
            })

        }

        if(searchBy === 'Category'){

            const categories = await Category.find({'tags.tag' : searchTag})

            if(!categories.length){
                return res.status(204).json({
                   message : "No Categories found"
                })
            }


            return res.status(200).json({
                message : 'Categories found',
                data:{
                    nameOfResource : 'Category',
                    categories,
                    number : categories.length
                }
            })
        }
    }
    catch(e){
       console.log(e)
    }
}

module.exports = search;