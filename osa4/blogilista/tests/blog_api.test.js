const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { console } = require('node:inspector')

const api = supertest(app)  // Supertestin avulla voidaan testata express-sovelluksia. 
// meidän ei tarvitse erikseen käynnistää palvelinta ennen testauksen aloittamista.


beforeEach(async () => {
  await Blog.deleteMany({})
  console.log('cleared')

  const initialBlogs1 = await helper.initialBlogs()

  const blogObjects = initialBlogs1.map(blog => new Blog(blog))
  
  const promiseArray = blogObjects.map(blog => blog.save())
 
  await Promise.all(promiseArray)
  
  console.log('added initial blogs')
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/) // Regex alkaa ja loppuu vinoviivaan /
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  const initialBlogs1 = await helper.initialBlogs() 
  assert.strictEqual(response.body.length, initialBlogs1.length)
})
test('identified blogs have id field', async () => {
  const response = await api.get('/api/blogs')

  const blogs = response.body
  blogs.forEach(blog => {
    assert.strictEqual(blog.hasOwnProperty('id'), true)
    assert.strictEqual(typeof blog.id, 'string')
  })
})

test('a specific blog is within the returned blogs', async () => {
  const response = await api.get('/api/blogs')

  const titles = response.body.map(e => e.title)
  assert.strictEqual(titles.includes('Kuopion kalat'), true)
})

test('a specific blog can be viewed', async () => {
  const blogsAtStart = await helper.blogsInDb()
  console.log('blogs at start:', blogsAtStart) // 👈 tähän
  const blogToView = blogsAtStart[0]
  console.log('blog to view:', blogToView) // 👈 tähän
  const resultBlog = await api
    .get(`/api/blogs/${blogToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)
  console.log('result blog:', resultBlog.body) // 👈 tähän
  // assert.deepStrictEqual(resultBlog.body, blogToView)
  assert.strictEqual(resultBlog.body.title, blogToView.title)
  assert.strictEqual(resultBlog.body.author, blogToView.author)
  assert.strictEqual(resultBlog.body.url, blogToView.url)
  assert.strictEqual(resultBlog.body.likes, blogToView.likes)

})

test('a valid blog can be added to /api/blogs', async () => {
  const usersAtStart = await helper.usersInDb()
  console.log('users at start:', usersAtStart) // 👈 tähän
  const initialBlogs1 = await helper.initialBlogs() 
  const userIdAtStart = usersAtStart[0].id

  // Generate a valid JWT token for the user
  const token = jwt.sign(
    { username: usersAtStart[0].username, id: userIdAtStart },
    process.env.SECRET,
    { expiresIn: '7d' }
  )

  const newBlog = {
    title: 'Ulkona on kylmää',
    author: 'Timo Tester',
    url: 'http://www.salo.fi',
    likes: 55
  }  

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

   
  //const response = await api.get('/api/blogs')
  const blogsAtEnd = await helper.blogsInDb() // Muutettu vastaamaan test_helperin uutta funktiota
  assert.strictEqual(blogsAtEnd.length, initialBlogs1.length + 1)

  const titles = blogsAtEnd.map(r => r.title)
  assert.strictEqual(titles.includes('Ulkona on kylmää'), true)
})

test('if likes property is missing, it will default to 0', async () => {
  const usersAtStart = await helper.usersInDb()
  const userIdAtStart = usersAtStart[0].id
  const initialBlogs1 = await helper.initialBlogs() 
  // Generate a valid JWT token for the user
  const token = jwt.sign(
    { username: usersAtStart[0].username, id: userIdAtStart },
    process.env.SECRET,
    { expiresIn: '7d' }
  )
  const newBlog = {
    title: 'Kesä on täällä',
    author: 'Paksu Pekka',
    url: 'http://www.kesablogi.fi'  //userId: userIdAtStart                     // Lisäämällä kelvollinen userId kenttä        
  }

  const response =  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, 0)
  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, initialBlogs1.length + 1)
})

test('blog without content is not added', async () => {
  const usersAtStart = await helper.usersInDb()
  const userIdAtStart = usersAtStart[0].id
  const initialBlogs1 = await helper.initialBlogs() 
  // Generate a valid JWT token for the user
  const token = jwt.sign(
    { username: usersAtStart[0].username, id: userIdAtStart },
    process.env.SECRET,
    { expiresIn: '7d' }
  )
  
  const newBlog = {

    }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, initialBlogs1.length)
  })

test('blog without title and no url is not added', async () => {
  const usersAtStart = await helper.usersInDb()
  const userIdAtStart = usersAtStart[0].id
  const initialBlogs1 = await helper.initialBlogs() 
  // Generate a valid JWT token for the user
  const token = jwt.sign(
    { username: usersAtStart[0].username, id: userIdAtStart },
    process.env.SECRET,
    { expiresIn: '7d' }
  )
  
  const newBlog = {
    author: 'No Title and URL',
    likes: 3

    }
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, initialBlogs1.length)
  })

  test('blog with no title but with url , is not added', async () => {
  const usersAtStart = await helper.usersInDb()
  const userIdAtStart = usersAtStart[0].id
  const initialBlogs1 = await helper.initialBlogs() 
  // Generate a valid JWT token for the user
  const token = jwt.sign(
    { username: usersAtStart[0].username, id: userIdAtStart },
    process.env.SECRET,
    { expiresIn: '7d' }
  )
  const newBlog = {
    author: 'No Title ,url is here',
    url: 'http://www.notitle.fi',
    likes: 3

    }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, initialBlogs1.length)
  })

  test('blog with title but without url is not added', async () => {
  const usersAtStart = await helper.usersInDb()
  const userids = await helper.userIdsInDb()
  const userIdAtStart = usersAtStart[0].id
  const initialBlogs1 = await helper.initialBlogs() 
  // Generate a valid JWT token for the user
  const token = jwt.sign(
    { username: usersAtStart[0].username, id: userids[0]},
    process.env.SECRET,
    { expiresIn: '7d' }
  )
  
  const newBlog = {
    title: 'No URL but title is here',
    author: 'No URL',
    likes: 3

    }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, initialBlogs1.length)
  })

test('a blog can be deleted', async () => {
  const usersAtStart = await helper.usersInDb()
  const userIdAtStart = usersAtStart[0].id
  const initialBlogs1 = await helper.initialBlogs() 
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  const token = jwt.sign(
    { username: usersAtStart[0].username, id: userIdAtStart },
    process.env.SECRET,
    { expiresIn: '7d' }
  )


  await api    
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  const ids = blogsAtEnd.map(n => n.id)
  assert(!ids.includes(blogToDelete.id))

  assert.strictEqual(blogsAtEnd.length, initialBlogs1.length - 1)
})

test.only('any blog property like: "likes", can be updated', async () => {
  const usersAtStart = await helper.usersInDb()
  const userIdAtStart = usersAtStart[0].id
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[1]
  const userIdsAtStart = await helper.userIdsInDb()  // no need 
  console.log('userIds at start:', userIdsAtStart) // 👈 tähän

  if (!userIdsAtStart.includes(userIdAtStart)) {
    throw new Error('Blogin userId ei löydy tietokannasta')
  }
  const token = jwt.sign(
    { username: userIdAtStart.username, id: blogToUpdate.id },
    process.env.SECRET,
    { expiresIn: '7d' }
  )

  const updatedBlogData = {
    title: blogToUpdate.title,
    author: blogToUpdate.author,
    url: blogToUpdate.url,
    likes: 113 // Päivitetään vain "likes" kenttä, muut kentät pysyvät ennallaan userId: blogToUpdate.userId   
    }

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .set('Authorization', `Bearer ${token}`)
    .send(updatedBlogData)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, updatedBlogData.likes)

  const blogsAtEnd = await helper.blogsInDb()
  const updatedBlog = blogsAtEnd.find(b => b.id === blogToUpdate.id)
  assert.strictEqual(updatedBlog.likes, updatedBlogData.likes)
})


test('any blog property like: "url" or/and "title", can be updated', async () => {
  const usersAtStart = await helper.usersInDb()
  const userIdAtStart = usersAtStart[0].id
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  const token = jwt.sign(
    { username: usersAtStart[0].username, id: blogToUpdate.userId },
    process.env.SECRET,
    { expiresIn: '7d' }
  )

  const updatedBlogData = {
    title: "A whole new title here",
    author: blogToUpdate.author,
    url: "A new url here.com",
    likes: blogToUpdate.likes 
      }

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .set('Authorization', `Bearer ${token}`)
    .send(updatedBlogData)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, updatedBlogData.likes)

  const blogsAtEnd = await helper.blogsInDb()
  const updatedBlog = blogsAtEnd.find(b => b.id === blogToUpdate.id)
  assert.strictEqual(updatedBlog.title, updatedBlogData.title)
  assert.strictEqual(updatedBlog.url, updatedBlogData.url)
})

test('a valid blog can not be added to /api/blogs if token is missing', async () => {
  const usersAtStart = await helper.usersInDb()
  console.log('users at start:', usersAtStart) // 👈 tähän
  const initialBlogs1 = await helper.initialBlogs() 
  const userIdAtStart = usersAtStart[0].id

  // Generate a valid JWT token for the user
  // const token = jwt.sign(
  //   { username: usersAtStart[0].username, id: userIdAtStart },
  //   process.env.SECRET,
  //   { expiresIn: '7d' }
  // )
  const token = null // testing invalid token case
  const newBlog = {
    title: 'Kesä on tulossa ja on jo täällä',
    author: 'Timo Tester',
    url: 'http://www.kesablogi.fi',
    likes: 555
  }  

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(401) // Unauthorized status code, koska token on puuttuu tai virheellinen
    .expect('Content-Type', /application\/json/)

   
  //const response = await api.get('/api/blogs')
  const blogsAtEnd = await helper.blogsInDb() // Muutettu vastaamaan test_helperin uutta funktiota
  assert.strictEqual(blogsAtEnd.length, initialBlogs1.length + 0) // Blogia ei pitäisi lisätä, joten odotetaan samaa määrää kuin alussa

  const titles = blogsAtEnd.map(r => r.title)
  assert.strictEqual(titles.includes('Kesä on tulossa ja on jo täällä'), false)
})





after(async () => {
  await mongoose.connection.close()
})
