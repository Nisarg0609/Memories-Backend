import express from 'express'
import { getPosts,getPost,getPostsBySearch,createPost,updatePost,deletePost,likePost,commentPost,ratingPost } from '../controllers/postController.js'
import auth from '../middleware/middleware.js'

const router = express.Router()

router.get('/search',getPostsBySearch)
router.get('/',getPosts)
router.get('/:id',getPost)
router.post('/',auth,createPost)
router.patch('/:id',auth,updatePost)
router.patch('/:id/like',auth,likePost)
router.delete('/:id',auth,deletePost)
router.post('/:id/comment',auth,commentPost)
router.post('/:id/rating',auth,ratingPost)

export default router 


