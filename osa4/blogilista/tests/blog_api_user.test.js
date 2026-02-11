const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const api = supertest(app)  // Supertestin avulla voidaan testata express-sovelluksia. 
// meidän ei tarvitse erikseen käynnistää palvelinta ennen testauksen aloittamista.


describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', name: 'admin user', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'timo_tester',
      name: 'Timo Tester',
      password: 'salainen1234',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    console.log(usernames)
    assert(usernames.includes(newUser.username))
  })
  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()
    console.log(usersAtStart)
    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400) // Change to 400 if validation is added in the user controller
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(result.body.error, 'username must be unique')

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })   
  test('all users are returned', async () => {
    const response = await api
       .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const initialUsers = await helper.usersInDb() 
    assert.strictEqual(response.body.length, initialUsers.length)
  }) 
})




after(async () => {
  await mongoose.connection.close()
})


