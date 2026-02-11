
const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')
const { userExtractor } = require('../utils/middleware')

// const getTokenFrom = request => {
//   const authorization = request.get('authorization')
//   if (authorization && authorization.startsWith('Bearer ')) {
//     return authorization.replace('Bearer ', '')
//   }
//   return null
// }


blogsRouter.get('/', async (request, response) => {

   const blogs = await Blog.find({})

   console.log('WITHOUT POPULATE:', blogs) // 👈 tähän

   const populatedBlogs = await Blog
         .find({})
         .populate('user', { 
          username: 1,
          name: 1 
        })
   console.log('WITH POPULATE:', populatedBlogs) // 👈 tähän

   response.json(populatedBlogs)
  })

blogsRouter.get('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
      response.json(blog)
    } else {
      response.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

blogsRouter.delete('/:id', userExtractor, async (request, response, next) => {
  try {
    const id = request.params.id
    console.log('ID TO DELETE:', id) // 👈 tähän
    const blogToDelete = await Blog.findById(id)
    console.log('BLOG TO DELETE:', blogToDelete) // 👈 tähän
    // const decodedToken = jwt.verify(
    //   request.token, 
    //   process.env.SECRET)
      
    // console.log('DECODED TOKEN:', decodedToken) // 👈 tähän
    // if (!decodedToken.id) {
    // return response.status(401).json({ error: 'token invalid' })
    // }
    //const userid = decodedToken.id
    const user = request.user
    const userid = user._id
    console.log('USER ID FROM TOKEN:', userid) // 👈 tähän

    if (!blogToDelete) {
      return response.status(404).json({ error: `blog with id: ${id} not found ` })
    }

    if (blogToDelete.user.toString() !== userid.toString()) {
      return response.status(403).json({ error: 'only the creator can delete blogs' })
    }

    await Blog.findByIdAndDelete(id)
    response.status(204).end() // No content
  } catch (error) {
    next(error)
  }
})



blogsRouter.post('/', userExtractor, async (request, response, next) => {

  console.log('BODY:', request.body)   // 👈 tähän
 // console.log('TOKEN FROM MIDDLEWARE:', request.token)// 👈 tähän          getTokenFrom(request)
  
  const body = request.body
  
  // const decodedToken = jwt.verify(
  //       request.token, 
  //       process.env.SECRET)

  //  console.log('DECODED:', decodedToken) // 👈 tähä

  // if (!decodedToken.id) {
  //   return response.status(401).json({ error: 'token invalid' })
  // }
  
  //const user = await User.findById(decodedToken.id)
  const user = request.user
  console.log('USER:', user) // 👈 tähän
  
  
  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }
  const blog = new Blog({
    title: body.title, 
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
    
  })

  console.log('BLOG OBJ:', blog) // 👈 tähän

  try {
    // 3. Tallenna blogi
    const savedBlog = await blog.save()

    console.log('SAVED:', savedBlog) // 👈 tähän

    user.blogs = user.blogs.concat(savedBlog._id)
    // 4. Lisää blogi käyttäjälle
    await user.save()
  
    response.status(201).json(savedBlog)  

  } catch (error) {
    console.log('ERROR:', error) // 👈 tähän
    next(error)
  }
})
// original version without try-catch error handling
// blogsRouter.post('/', async (request, response, next) => {
  
//   const blog = new Blog(request.body)  

//   try {
//     const savedBlog = await blog.save()
//     response.status(201).json(savedBlog)
//   } catch (error) {
//     next(error)
//   }
// })

blogsRouter.put('/:id', async (request, response, next) => {
  const { title, author, url, likes } = request.body

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      { title, author, url, likes },
      { new: true, runValidators: true, context: 'query' }
    )
    if (updatedBlog) {
      response.json(updatedBlog)
    } else {
      response.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter
