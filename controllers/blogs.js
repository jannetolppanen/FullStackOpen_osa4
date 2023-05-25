const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response
    .json(blogs)
    .status(200)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  if (!body.title || !body.url) {
    return response
      .status(400)
      .json({ error: 'title and url are required' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0
  })

  const savedBlog = await blog.save()
  response
    .status(201)
    .json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (exception) {
    next(exception)
  }
}
)

blogsRouter.put('/:id', async (request, response, next) => {
  try {
    const body = request.body
    console.log('body', body)
    
    const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes
    }
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response
    .json(updatedBlog)
    .status(200)

  } catch (exception) {
    next(exception)
  }
})


module.exports = blogsRouter