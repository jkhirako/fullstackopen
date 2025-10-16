const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (req, res) => {
  const blog = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })

  res.json(blog.map(m => m.toJSON()))
})

blogsRouter.post('/', userExtractor, async (req, res) => {
  const { title, author, url, likes } = req.body;
  const user = req.user

  if (!title || !url) {
    return res.status(400).json({ error: 'title or url missing' });
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
    user: user._id,
  });

  const savedBlog = await blog.save();

  user.blog = user.blog.concat(savedBlog._id)
  await user.save()
  
  res.status(201).json(savedBlog);
});


blogsRouter.delete('/:id', userExtractor, async (req, res) => {
  const user = req.user
  const blog = await Blog.findById(req.params.id)
  if (!blog) {
    return res.status(404).json({ error: 'blog not found' })
  }

  if (blog.user.toString() !== user._id.toString()) {
    return res.status(403).json({ error: 'unauthorized deletion' })
  }

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