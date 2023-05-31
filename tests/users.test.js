const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const logger = require('../utils/logger')

const initialUser = {
  "username": "test",
  "name": "tim tester",
  "password": "salasana"
}

beforeEach(async () => {
  await User.deleteMany({})
})

describe('User requests', () => {
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

  // test('Login with the test user', async () => {
  //   const createUser = await api
  //     .post('/api/users')
  //     .send(initialUser)

  //   const login = await api
  //     .post('/api/login')
  //     .send({
  //       "username": initialUser.username,
  //       "password": initialUser.password
  //     })
  //     .expect(200)
  // })

  test('Duplicate users cant be created', async () => {

    const createUser = await api
      .post('/api/users')
      .send(initialUser)

      const createDuplicateUser = await api
      .post('/api/users')
      .send(initialUser)
      .expect(400)

    expect(createDuplicateUser.body.error).toEqual(expect.stringContaining('User validation failed: username: Error'))

    const getResponse = await api
      .get('/api/users')

    expect(getResponse.body).toHaveLength(1)
  })

  test('Password must be atleast 3 characters', async () => {

    const newUserShortPassword = {
      "username": "testuser5",
      "name": "Test user5",
      "password": "qw"
    }

    const createShortPassword = await api
      .post('/api/users')
      .send(newUserShortPassword)
      .expect(400)

    expect(createShortPassword.body.error).toEqual("Password needs to be atleast 3 characters")

    const getResponse = await api
      .get('/api/users')
    expect(getResponse.body.length).toBe(0)
  })

  test('Username must be atleast 3 characters', async () => {

    const newUserShortUsername = {
      "username": "te",
      "name": "Test user4",
      "password": "qwerty"
    }
    const createShortName = await api
      .post('/api/users')
      .send(newUserShortUsername)
      .expect(400)

    expect(createShortName.body.error).toEqual("Username needs to be atleast 3 characters")

    const getResponse = await api
      .get('/api/users')
    expect(getResponse.body.length).toBe(0)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})