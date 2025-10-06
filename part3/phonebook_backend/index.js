const express = require('express')
const app = express()
app.use(express.json())
var morgan = require('morgan')
morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

app.use(express.static('dist'))
require('dotenv').config()
const Contact = require('./models/contact')

app.get('/api/persons', (req, res, next) => {
  Contact.find({})
    .then((contacts) => {
      res.json(contacts)
    })
    .catch((error) => next(error))
})

app.get('/info', (req, res, next) => {
  const time = new Date()
  Contact.countDocuments({})
    .then((count) => {
      res.send(`
    <div>Phonebook has info for ${count} people</div>
    <div>${time}</div>
    `)
    })
    .catch((error) => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  Contact.findById(req.params.id)
    .then((contact) => {
      if (contact) {
        res.json(contact)
      } else {
        const error = new Error('Contact not found')
        error.name = 'UnknownContact'
        return next(error)
      }
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Contact.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch((error) => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  if (!body.name || !body.number) {
    const error = new Error('Name or number missing')
    error.name = 'ValidationError'
    return next(error)
  }

  const person = new Contact({
    name: body.name,
    number: body.number,
  })

  person
    .save()
    .then((savedContact) => {
      res.json(savedContact)
    })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const { number } = req.body

  Contact.findById(req.params.id)
    .then((contact) => {
      if (!contact) {
        return res.status(404).end()
      }

      contact.number = number

      return contact.save().then((updatedContact) => {
        res.json(updatedContact)
      })
    })
    .catch((error) => next(error))
})

const errorHandler = (error, req, res, next) => {
  console.log(error.message)

  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  if (error.name === 'UnknownContact') {
    return res.status(404).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
