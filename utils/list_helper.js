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
  const favourite = blogs.reduce((previous, current) => {
    if (!previous.likes) {
      previous = current
    } else if (current.likes > previous.likes) {
      previous = current
    }
    return previous
  }, {})
  return favourite
}

  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
  }