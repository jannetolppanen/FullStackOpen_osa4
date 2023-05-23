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

describe('.get request', () => {

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

describe('.post request', () => {
  test('new blog can be added using post on api/blogs', async () => {

    const newBlog = {
      "title": "Astrophotography: Capturing the Universe",
      "author": "Sarah Starlight",
      "url": "https://www.skyshots.com",
      "likes": 10
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const contents = response.body.map(r => r.title)
    expect(response.body).toHaveLength(initialBlogs.length + 1)
    expect(contents).toContain(
      'Astrophotography: Capturing the Universe'
    )
  })
})

test('blog with no value for likes get 0 likes', async () => {
  const blogWithNoLikes = {
    "title": "Culinary Creations: Unleash Your Inner Chef",
    "author": "Gordon Breadknife",
    "url": "https://www.kitchensavvy.com"
  }
  const response = await api
    .post('/api/blogs')
    .send(blogWithNoLikes)

  expect(response.body['likes']).toBe(0)

})

test('blogpost without title or url returns 400', async () => {

  const blogWithoutTitle = {
    "author": "Olivia PaintBrush",
    "url": "https://www.artisticexplorations.com",
    "likes": 4
  }

  const blogWithoutUrl = {
    "title": "Fitness Fundamentals: Building A Healthy Lifestyle",
    "author": "Jackie JumpRope",
    "likes": 8
  }
  await api
    .post('/api/blogs')
    .send(blogWithoutTitle)
    .expect(400)

  await api
    .post('/api/blogs')
    .send(blogWithoutUrl)
    .expect(400)

})

afterAll(async () => {
  await mongoose.connection.close()
})