const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {


  const blogs = await Blog
  .find({}).populate('user', {"username": 1, "name": 1, "id": 1})
  response
    .json(blogs)
    .status(200)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findById("647386ec0d35be92ea9826d5")

  if (!body.title || !body.url) {
    return response
      .status(400)
      .json({ error: 'title and url are required' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response
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