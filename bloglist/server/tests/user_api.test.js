const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const helper = require('./test_helper.js')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  await User.insertMany(helper.initialUsers)
})

describe("adding a user", () => {
  test('a valid user can be added', async () => {
    const newUser = {
    username : 'Flutter Fan',
    name : 'Dart',
    password : 'Flutter is the best framework'
    }

    await api
      .post('/api/users')
      .send(newUser)

    const UsersAtEnd = await helper.usersInDb()
    assert.strictEqual(UsersAtEnd.length, helper.initialUsers.length + 1)
  })
})


after(async () => {
  await mongoose.connection.close()
})