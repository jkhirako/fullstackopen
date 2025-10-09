const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (req, res) => {
  const blog = await Blog.find({})
  res.json(blog.map(m => m.toJSON()))
})

blogsRouter.post('/', async (req, res) => {
  const blog = new Blog(req.body)

  if (!blog.title || !blog.url) {
    return res.status(400).json({ error: 'title or url missing'})
  }

  const savedBlog = await blog.save()
  res.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id)
  res.status(204).end()
})

blogsRouter.put('/:id', async (req, res) => {
  const { likes } = req.body
  const blog = await Blog.findById(req.params.id)

  if (!blog) {
    return res.status(404).end()
  } 

  blog.likes = likes
  const updatedBlog = await blog.save()
  res.json(updatedBlog)
})

module.exports = blogsRouter