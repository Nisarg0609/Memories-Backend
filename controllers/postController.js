import PostMessage from '../models/postModel.js'
import mongoose from 'mongoose'


export const createPost = async(req,res)=>{
    const post = req.body
    const newPost = new PostMessage({...post,createdAt:new Date().toISOString()})
    try {
        await newPost.save()

        res.status(200).json(newPost)
    } catch (error) {
        res.status(409).json({message:error.message})   
    }
}

export const getPosts = async(req,res)=>{
    const {page} = req.query
    try {
        const LIMIT = 6
        const startIndex = (Number(page)-1)*LIMIT
        const total = await PostMessage.countDocuments({})

        const posts = await PostMessage.find().sort({_id:-1}).limit(LIMIT).skip(startIndex)

        res.status(200).json({data:posts,currentPage:Number(page),numberOfPages:Math.ceil(total/LIMIT)})
    } catch (error) {
        res.status(404).json({message:error.message})
    }   
}


export const getPost = async(req,res)=>{
    const {id} = req.params
    try {
        const post = await PostMessage.findById(id)
        
        res.status(200).json(post)
    } catch (error) {
        res.status(404).json({message:error.message})
    }
}


export const getPostsBySearch = async(req,res)=>{
    const {searchQuery, tags} = req.query
    try {
        const title =  new RegExp(searchQuery,'i')

        const posts = await PostMessage.find({ $or: [ { title }, { tags: { $in: tags.split(',') } } ]})
        
        res.json({data:posts})
    } catch (error) {
        res.status(404).json({message:error})
    }
}


export const updatePost = async(req,res)=>{
    const {id : _id} = req.params
    const post = req.body
    try {
        if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send(`no post with id : ${id}`)
        
        const updatedData = await PostMessage.findByIdAndUpdate(_id,{...post,_id},{new:true})        
        res.send(updatedData)
    } catch (error) {
        res.status(404).json(error)
    }
}


// DELETE
export const deletePost = async(req,res)=>{
    const {id} = req.params
    try {
        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`no post with id ${id}`)

        await PostMessage.findByIdAndRemove(id)

        res.send('post deleted successfully')
    } catch (error) {
        res.status(404).json({message:error.message})
    }
}


// LIKE
export const likePost = async(req,res)=>{
    const {id} = req.params
    try {
        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`no post with id ${id}`)
        
        const post = await PostMessage.findById(id)
        
        if(!req.userId) return res.status(400).json({message:'Unauthenticated'})
        
        const index = post.likes.findIndex((id)=>id === String(req.userId))
        
        if(index == -1){
            post.likes.push(req.userId)
        }
        else{
            post.likes = post.likes.filter((id)=>id !== String(req.userId))
        }

        const updatedPost = await PostMessage.findByIdAndUpdate(id,post,{new:true})

        res.status(200).json(updatedPost)
    } catch (error) {
        res.send(error)
    }
}


export const commentPost = async(req,res)=>{
    const {id} = req.params
    const {value}= req.body

    try {
        const post = await PostMessage.findById(id)

        post.comments.push(value)

        const updatedPost = await PostMessage.findByIdAndUpdate(id,post,{new: true})

        res.status(200).json(updatedPost)
    } catch (error) {
        res.status(404).json(error)
    }
}


export const ratingPost = async(req,res)=>{
    const {id} = req.params
    const {rating} = req.body
    
    try {        
        const post = await PostMessage.findById(id)
                
        const index = post.ratingId.findIndex((id)=>id === String(req.userId))

        if(index == -1){
            post.ratingId.push(req.userId)
            post.ratingArray.push(rating)
        }
        else{
            post.ratingArray[index] = rating;
        }
        
        post.reviews = post.ratingId.length
        
        let sum = 0;
        for(let i=0; i<post.ratingArray.length; i++){
            sum += post.ratingArray[i]
        }
        
        const result = sum / post.ratingArray.length;;
        post.rating = result

        const updatedPost = await PostMessage.findByIdAndUpdate(id,post,{new:true})

        res.status(200).json(updatedPost)
    } catch (error) {
        res.send(error)
    }
}
