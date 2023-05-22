const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

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

})

afterAll(async () => {
  await mongoose.connection.close()
})