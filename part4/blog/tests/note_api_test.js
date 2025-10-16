const { test, after, beforeEach, describe, before } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const api = supertest(app)



describe('when creating a blog post', () => {

  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  test('successfully creates a new blog post', async () => {
    const newBlog = {
      title: "new title",
      author: "new author",
      url: "www.newurl.com",
      likes: 11,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogs = await helper.blogsInDb()
    assert.strictEqual(blogs.length, helper.initialBlogs.length + 1)
    const contents = blogs.map(b => b.title)
    assert(contents.includes('new title'))
  })

  test('verify title and url exists', async () => {
    const newBlog = {
      author: "new author",
      likes: 9,
    }
    
    await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
  })

  test('likes property missing defaults to 0', async () => {
    const newBlog = {
      title: "new title",
      author: "new author",
      url: "www.newurl.com",
    }

    const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, 0)
  })

  test('blog count is correct', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  describe('viewing a specific blog by an id', () => {
    test('unique identifier is named id', async () => {
    const response = await api.get('/api/blogs')
    const blog = response.body[0]

    assert.strictEqual(typeof blog.id, 'string')
    assert.strictEqual(blog._id, undefined)
    })
  })

  describe('when deleting a single blog', () => {
    test('succeeds with code 204 when a blog is deleted via an id', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)
      
      const blogsAtEnd = await helper.blogsInDb()
      const blogTitle = blogsAtEnd.map(b => b.title)

      assert(!blogTitle.includes(blogToDelete.title))
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })
  })

  describe('when updating information of a blog', () => {
    test('updates the number of likes', async () => {
      const newBlog = {
        likes: 56
      };

      const blogsAtStart = await helper.blogsInDb();
      const blogToUpdate = blogsAtStart[0];

      const res = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      assert.strictEqual(res.body.likes, 56); 
    });
  });
})

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('secret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'joshiee02',
      name: 'Joshua Kenta Remulta',
      password: 'secret'
    }

    await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const username = usersAtEnd.map(u => u.username)
    assert(username.includes(newUser.username))
  })

  test('errors when user username less than 3 characters long', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 't',
      name: 'test',
      password: 'secret'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    assert(result.body.error.includes('username'))

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtStart.length, usersAtEnd.length)
  })

  test.only('errors when username already exists', async () => {
  const usersAtStart = await helper.usersInDb();

  const newUser = {
    username: 'root',
    name: 'test',
    password: 'secret'
  };

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/);

  assert(result.body.error.includes('username'));

  const usersAtEnd = await helper.usersInDb();
  assert.strictEqual(usersAtEnd.length, usersAtStart.length);
});

  test('errors when user password is less than 3 characters long', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'test',
      name: 'test',
      password: 'se'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    assert(result.body.error.includes('password must be at least 3 characters long'))

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtStart.length, usersAtEnd.length)
  })

  test('errors when password is missing', async () => {
  const usersAtStart = await helper.usersInDb();

  const newUser = {
    username: 'test',
    name: 'test'
  };

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/);

  assert(result.body.error.includes('username must be unique'));

  const usersAtEnd = await helper.usersInDb();
  assert.strictEqual(usersAtEnd.length, usersAtStart.length);
});

})


after(async () => {
  await mongoose.connection.close()
})