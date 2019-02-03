require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./modules/person')

morgan.token('post', function(req, res) {
  return JSON.stringify(req.body)
})

app.use(bodyParser.json())
app.use(
  morgan(function(tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'),
      '-',
      tokens['response-time'](req, res),
      'ms',
      '-',
      tokens.post(req, res)
    ].join(' ')
  })
)
app.use(cors())
app.use(express.static('build'))

let persons = [
  {
    name: 'Arto Hellas',
    number: '040-254163',
    id: 1
  },
  {
    name: 'Martti Tienari',
    number: '040-123456',
    id: 2
  },
  {
    name: 'Arto Järvinen',
    number: '040-123456',
    id: 3
  },
  {
    name: 'Lea Kutvonen',
    number: '040-123456',
    id: 4
  }
]

const getId = () => Math.floor(Math.random() * Math.floor(100000))

app.get('/api/persons', (request, response) => {
  Person.find({}).then(people => {
    console.log(people)
    response.json(people.map(person => person.toJSON()))
  })
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name.trim() || !body.number.trim()) {
    return response
      .status(400)
      .json({ error: 'name and phonenumber must not be empty' })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson.toJSON())
  })
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(p => p.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(p => p.id !== id)

  response.status(204).end()
})

app.get('/info', (request, response) => {
  const text = `<p>Puhelinluettelossa on ${
    persons.length
  } henkilön tiedot\n</p> <p>${Date()}</p>`

  console.log(text)
  response.send(text)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
