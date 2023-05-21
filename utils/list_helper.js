const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  if (blogs.length === 0) {
    return 0
  } else if (blogs.length === 1) {
    return blogs[0].likes
  } else {
    result = blogs.reduce((accumulator, blog) => {
      return accumulator + blog.likes
    }, 0)
  }
  return result
}

const favoriteBlog = (blogs) => {
  if (blogs.length > 0) {
    const mostLikedBlog = _.maxBy(blogs, 'likes')
    const { title, author, likes } = mostLikedBlog
    return { title, author, likes }
  } else {
    return 0
  }
}



module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}