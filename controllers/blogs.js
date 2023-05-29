const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const logger = require('../utils/logger')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { "username": 1, "name": 1, "id": 1 })
  response
    .json(blogs)
    .status(200)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)

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
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    logger.info("decodedToken:", decodedToken);

    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' });
    }

    const blog = await Blog.findById(request.params.id);
    logger.info("blog", blog);

    if (blog.user.toString() === decodedToken.id.toString()) {
      logger.info("blog.user === decodedtoken.id");

      await Blog.findByIdAndRemove(request.params.id);
      logger.info("blog removed");

      response.status(204).end();
    } else {
      return response.status(401).json({ error: 'token invalid' });
    }
  } catch (exception) {
    logger.error("exception:", exception);
    next(exception);
  }
})


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