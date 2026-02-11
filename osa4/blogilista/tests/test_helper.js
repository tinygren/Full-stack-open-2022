

const Blog = require('../models/blog')
const User = require('../models/user')

const oneuserIdAtStart = async () => {
const users = await User.find({})
return users[0]._id.toString()
}

const initialBlogs = async () => {
const userId = await oneuserIdAtStart()


const firstinitialBlogs = [
{
title: 'Kuopion kalat',
author: 'Timo Tyyni',
url: 'www.kuopionkalat.fi',
likes: 7,
user: ""
},
{
title: 'Helsingin hungit',
author: 'Hanna Hietanen',
url: 'www.helsinginhungit.fi',
likes: 3,
user: ""
}
]


const createInitialBlogs = firstinitialBlogs.map(blog => ({
...blog,
user: userId
}))


return createInitialBlogs
}


const nonExistingId = async () => {
  const blog = new Blog({ 
    title: 'willremovethissoon',
    author: 'noone',
    url: 'www.nowhere.fi'
 })
  await blog.save()
  await blog.deleteOne()
  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  //console.log("usersindb:", users)
  return users.map(u => u.toJSON())
}

const userIdsInDb = async () => {                       // draft
  const users = await User.find({}).select('_id')
  console.log("TÄMÄ JOO userIdsInDb:", users)
  return users.map(u => u._id.toString())
}




module.exports = {
  initialBlogs, nonExistingId, blogsInDb, usersInDb, userIdsInDb
}
