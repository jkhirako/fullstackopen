const blog = require('../models/blog')
const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: "test title",
    author: "test author",
    url: "www.testurl.com",
    likes: 52
  },
  {
    title: "another title",
    author: "another author",
    url: "www.anotherurl.com",
    likes: 12
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs,
  blogsInDb,
  usersInDb
}