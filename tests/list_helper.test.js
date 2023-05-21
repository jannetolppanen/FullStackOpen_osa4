const { result } = require('lodash')
const listHelper = require('../utils/list_helper')
listOfBlogs = require('./testVars/listOfBlogs').blogs
singleBlog = require('./testVars/singleBlog').blog
emptyArray = []


describe('dummy test', () => {
  test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
  })
})

describe('total likes', () => {
  test('returns number of likes with many blogs', () => {
    const blogs = listOfBlogs
    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(36)
  })

  test('returns number of likes with single blog', () => {
    const blogs = singleBlog
    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(7)
  })

  test('returns 0 with empty array', () => {
    const blogs = emptyArray
    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(0)
  })

})

describe('favoriteBlog', () => {
  test('returns most favourited blog with many blogs', () => {
    const blogs = listOfBlogs
    const result = listHelper.favoriteBlog(blogs)
    expect(result).toEqual({
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12
    })
  })
  test('returns most favourited blog with one blog', () => {
    const blogs = singleBlog
    const result = listHelper.favoriteBlog(blogs)
    expect(result).toEqual({
      title: "React patterns",
      author: "Michael Chan",
      likes: 7
    })
  })
  test('returns 0 with empty array', () => {
    const blogs = []
    const result = listHelper.favoriteBlog(blogs)
    expect(result).toBe(0)
  })
})

describe('most liked author', () => {
  test('returns most liked author and amount of likes with many blogs', () => {
    const blogs = listOfBlogs
    const result = listHelper.mostBlogs(blogs)
    expect(result).toEqual(
      {
        author: "Robert C. Martin",
        blogs: 3
      }
    )
  })
  test('returns most liked author with single blog', () => {
    const blogs = singleBlog
    const result = listHelper.mostBlogs(blogs)
    expect(result).toEqual(
      {
        author: "Michael Chan",
        blogs: 1
      }
    )
  })
  test('returns 0 with empty array', () => {
    const blogs = []
    const result = listHelper.mostBlogs(blogs)
    expect(result).toBe(0)
  })
})