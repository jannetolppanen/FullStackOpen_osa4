const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
  {
    "title": "Gardening Wonders: The Ultimate Guide",
    "author": "Emma GreenThumb",
    "url": "https://www.gardensense.com",
    "likes": 7
  },
  {
    "title": "Tech Innovations: What's Next in AI?",
    "author": "Martin Byte",
    "url": "https://www.byteintofuture.com",
    "likes": 5
  },
]

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

describe('.get /api/blogs', () => {

  test('blogs are returned as json', async () => {
    const response = await api
      .get('/api/blogs')

    expect(response.header['content-type']).toContain('application/json')
  })

  test('length is 2', async () => {
    const response = await api
      .get('/api/blogs')

    expect(response.body).toHaveLength(2)
  })

  test('id exists', async () => {
    const response = await api
      .get('/api/blogs')

    response.body.map(blog => {
      expect(blog.id).toBeDefined()
    })

  })

})

afterAll(async () => {
  await mongoose.connection.close()
})