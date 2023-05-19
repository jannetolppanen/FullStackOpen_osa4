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



  module.exports = {
    dummy,
    totalLikes
  }