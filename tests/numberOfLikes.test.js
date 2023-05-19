const listHelper = require('../utils/list_helper')
listOfBlogs = require('./testVars/listOfBlogs').blogs
singleBlog = require('./testVars/singleBlog').blog
emptyArray = []


describe('Number of likes', () => {
  test('returns number of likes with many blogs', () => {
    const blogs = listOfBlogs
    result = listHelper.totalLikes(blogs)
    expect(result).toBe(36)
  })

  test('returns number of likes with single blog', () => {
    const blogs = singleBlog
    result = listHelper.totalLikes(blogs)
    console.log('result', result)
    expect(result).toBe(7)
  })

  test('returns 0 with empty array', () => {
    const blogs = emptyArray
    result = listHelper.totalLikes(blogs)
    expect(result).toBe(0)
  })

})