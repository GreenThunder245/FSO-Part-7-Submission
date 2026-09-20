const User = require('../models/user')

const initialUsers = [
  {
    username : 'hellas',
    name : 'Arto Hellas',
    password : 'Arto password'
  },
  {
    username : 'mluukkai',
    name : 'Matti Luukkainen',
    password : 'Matti password'
  }
]

const nonExistingId = async () => {
  const user = new User({
    username : 'Ohio',
    name : 'thats not a blogger',
    password : 'only in ohio'
  })
  await user.save()
  await user.deleteOne()

  return blog._id.toString()
}

const usersInDb = async () => {
  const user = await User.find({})
  return user.map(note => note.toJSON())
}

module.exports = {
  initialUsers, nonExistingId, usersInDb
}