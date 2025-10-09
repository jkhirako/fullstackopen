const Blog = require('../models/blog')

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

module.exports = {
  initialBlogs,
  blogsInDb
}