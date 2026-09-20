var _ = require('lodash');

const dummy = (blogs) => {
  return 1
}
const totalLikes = (blogs) => {
  return blogs.reduce((accumulator, currentValue) => accumulator + currentValue.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return {}
  }
  return blogs.reduce((accumulator, currentValue) => {
    if (currentValue.likes > accumulator.likes) {
      return currentValue
    }
    return accumulator
  })
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return {}
  }
  return _(blogs)
    .countBy('author')
    .toPairs()
    .map((pair) => ({ author: pair[0], blogs: pair[1] }))
    .maxBy('blogs');
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return {}
  }  
  return _(blogs)
    .groupBy('author')
    .mapValues((authorBlogs) => _.sumBy(authorBlogs,'likes'))
    .toPairs()
    .map((pair) => ({ author: pair[0], likes: pair[1] }))
    .maxBy('likes');
}
module.exports = {
  dummy, totalLikes , favoriteBlog, mostBlogs, mostLikes
}