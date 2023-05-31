const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const logger = require('../utils/logger')

const initialUser = {
  "username": "test",
  "name": "tim tester",
  "password": "salasana"
}

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

// Remove all blogs from the testing collection before running tests. Make 2 blogposts.
beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

})

describe('Login', () => {
  test('Creating a new user', async () => {
    await User.deleteMany({})
    const createUser = await api
      .post('/api/users')
      .send(initialUser)
      .expect(201)

    const createdUser = createUser.body
    const getUsers = await api
      .get('/api/users')
      .expect(200)
    const users = getUsers.body
    const exists = users.some((user) => user.username === createdUser.username)
    expect(exists).toBe(true)
  })

  test('Login with the test user', async () => {
    const createUser = await api
      .post('/api/users')
      .send(initialUser)

    const login = await api
      .post('/api/login')
      .send({
        "username": initialUser.username,
        "password": initialUser.password
      })
      .expect(200)
  })
})

describe('.get request', () => {

  test('blogs are returned as json', async () => {
    const response = await api
      .get('/api/blogs')

    expect(response.header['content-type']).toContain('application/json')
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

    const createUser = await api
      .post('/api/users')
      .send(initialUser)

    const login = await api
      .post('/api/login')
      .send({
        "username": initialUser.username,
        "password": initialUser.password
      })

    const token = login.body.token

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const contents = response.body.map(r => r.title)
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

  const createUser = await api
    .post('/api/users')
    .send(initialUser)

  const login = await api
    .post('/api/login')
    .send({
      "username": initialUser.username,
      "password": initialUser.password
    })

  const token = login.body.token

  const response = await api
    .post('/api/blogs')
    .send(blogWithNoLikes)
    .set('Authorization', `Bearer ${token}`)

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

  const createUser = await api
    .post('/api/users')
    .send(initialUser)

  const login = await api
    .post('/api/login')
    .send({
      "username": initialUser.username,
      "password": initialUser.password
    })

  const token = login.body.token
  await api
    .post('/api/blogs')
    .send(blogWithoutTitle)
    .set('Authorization', `Bearer ${token}`)
    .expect(400)

  await api
    .post('/api/blogs')
    .send(blogWithoutUrl)
    .set('Authorization', `Bearer ${token}`)
    .expect(400)

})

describe('delete request', () => {
  test('deleting id removes it from server', async () => {
    const blogs = await api
      .get('/api/blogs')
    const idToBeDeleted = blogs.body[0].id
    await api
      .delete(`/api/blogs/${idToBeDeleted}`)
      .expect(204)
    await api
      .get(`/api/blogs/${idToBeDeleted}`)
      .expect(404)

  })
})

describe('put request', () => {
  test('updating the number of likes works', async () => {
    const blogs = await api
      .get('/api/blogs')
    const blogToUpdate = blogs.body[0]
    const idToUpdate = blogToUpdate.id
    const updatedBlog = {
      title: blogToUpdate.title,
      author: blogToUpdate.author,
      url: blogToUpdate.url,
      likes: 1337
    }
    await api
      .put(`/api/blogs/${idToUpdate}`)
      .send(updatedBlog)
      .expect(200)
      .expect((response) => {
        expect(response.body.likes).toBe(1337)
      })

  })
})

afterAll(async () => {
  await mongoose.connection.close()
})