const Blog = require('../models/blog')
const User = require('../models/user')

const initialUsers = [
  {
    username : 'React Patterns',
    name : 'Michael Chan',
    password : 'JSX',
    _id: '6a7f3aa7b00f07995b820828',
    blogs : ['6a7f3aa59b23904236776369'],
    passwordHash : '$2b$10$0by5DGz9YIt3Z4lEZT/pBerW9VcEyb/NbLjXozkPvZM8AvZiXJR3m'
  },
  {
    username : 'Short Way',
    name : 'Edsger W. Dijkstra',
    password : 'Dijkstra\'s Algorithm',
    _id: '6a7f3aa7b00f07995b820829',
    blogs : ['6a7f3aa59b2390423677636a','6a7f3aa59b2390423677636b'],
    passwordHash : '$2b$10$kJhX9JTYUUvMPCQ7fOdTu.ssqEBioh/QBYN4OJDgLcVNRxtnH6Cn6'
  },
  {
    username : 'Uncle Bob',
    name : 'Robert C. Martin',
    password : 'clean code',
    _id: '6a7f3aa7b00f07995b82082a',
    blogs : ['6a7f3aa59b2390423677636c','6a7f3aa59b2390423677636d','6a7f3aa59b2390423677636e'],
    passwordHash : '$2b$10$YOdNN7PZwTKCA7gp7EyvreoIp7S/J7fYB.rNpGS6qI33YCy/X/SB.'
  }
]

const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    _id: '6a7f3aa59b23904236776369',
    user: '6a7f3aa7b00f07995b820828'
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    _id: '6a7f3aa59b2390423677636a',
    user: '6a7f3aa7b00f07995b820829'
  },
  {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    _id: '6a7f3aa59b2390423677636b',
    user: '6a7f3aa7b00f07995b820829'
  },
  {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    _id: '6a7f3aa59b2390423677636c',
    user: '6a7f3aa7b00f07995b82082a'
  },
  {
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    _id: '6a7f3aa59b2390423677636d',
    user: '6a7f3aa7b00f07995b82082a'
  },
  {
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    _id: '6a7f3aa59b2390423677636e',
    user: '6a7f3aa7b00f07995b82082a'
  }
]

const nonExistingBlogId = async () => {
  const blog = new Blog({
      title: ' Programming is terrible—Lessons learned from a life wasted. EMF2012',
      author: 'tef ebooks',
      url: "https://www.youtube.com/watch?v=csyL9EC0S0c",
      likes: 1})
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blog = await Blog.find({})
  return blog.map(note => note.toJSON())
}

const nonExistingUserId = async () => {
  const user = new User({
    username : 'Ohio',
    name : 'thats not a blogger',
    password : 'only in ohio'
  })
  await user.save()
  await user.deleteOne()

  return user._id.toString()
}

const usersInDb = async () => {
  const user = await User.find({})
  return user.map(note => note.toJSON())
}

module.exports = {
  initialUsers,
  initialBlogs,
  usersInDb,
  blogsInDb,
  nonExistingUserId,
  nonExistingBlogId
}