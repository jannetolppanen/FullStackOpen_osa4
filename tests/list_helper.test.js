const listHelper = require('../utils/list_helper')
listOfBlogs = require('./testVars/listOfBlogs').blogs
singleBlog = require('./testVars/singleBlog').blog
emptyArray = []


test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  console.log('$$ result $$', result)
  expect(result).toBe(1)
})


describe('Total likes', () => {
  test('returns number of likes with many blogs', () => {
    const blogs = listOfBlogs
    result = listHelper.totalLikes(blogs)
    expect(result).toBe(36)
  })

  test('returns number of likes with single blog', () => {
    const blogs = singleBlog
    result = listHelper.totalLikes(blogs)
    expect(result).toBe(7)
  })

  test('returns 0 with empty array', () => {
    const blogs = emptyArray
    result = listHelper.totalLikes(blogs)
    expect(result).toBe(0)
  })

})

describe('Favourite blog', () => {
  test('returns favourite blog object', () => {
    const blogs = listOfBlogs
    const result = listHelper.favoriteBlog(blogs)
    expect(result).toEqual(
      {
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        likes: 12
      }
    )
  })
}
)