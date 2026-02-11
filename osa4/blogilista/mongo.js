require('dotenv').config()
const mongoose = require('mongoose')

const password = process.env.MONGODB_PASSWORD
//const mongoUrl = `mongodb+srv://timonygren_db_user:${password}@cluster0.hpoizdi.mongodb.net/blogApp?appName=Cluster0`
const test_mongoUrl = `mongodb+srv://timonygren_db_user:${password}@cluster0.hpoizdi.mongodb.net/testBlogApp?appName=Cluster0`
const mongoUrl = test_mongoUrl
mongoose.set('strictQuery', false)
mongoose.connect(mongoUrl)

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})

const Blog = mongoose.model('Blog', blogSchema)

const blog = new Blog({
  title: 'Full Stack -websovelluskehitys',   
  author: 'Liisa Laiskainen',
  url: 'www.fullstack.fi',
  likes: 15,
})

blog.save().then(() => {
  console.log('blog saved!')
  mongoose.connection.close()
})
