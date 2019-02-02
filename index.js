const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())

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
  response.json(persons)
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name.trim() || !body.number.trim()) {
    return response
      .status(400)
      .json({ error: 'name and phonenumber must not be empty' })
  }

  const alreadyHere = persons.filter(
    p => p.name === body.name || p.number === body.number
  )

  if (alreadyHere.length > 0) {
    return response
      .status(400)
      .json({ error: 'name and phonenumber must be unique' })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: getId()
  }

  persons = persons.concat(person)
  response.json(person)
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

const port = 3001

app.listen(port)
console.log(`Server running on port ${port}`)
