const express = require("express")
const app = express()
const bodyParser = require("body-parser")

app.use(bodyParser.json())

let persons = [
  {
    name: "Arto Hellas",
    number: "040-254163",
    id: 1
  },
  {
    name: "Martti Tienari",
    number: "040-123456",
    id: 2
  },
  {
    name: "Arto Järvinen",
    number: "040-123456",
    id: 3
  },
  {
    name: "Lea Kutvonen",
    number: "040-123456",
    id: 4
  }
]

app.get("/api/persons", (request, response) => {
  response.json(persons)
})

app.get("/info", (request, response) => {
  const text = `<p>Puhelinluettelossa on ${
    persons.length
  } henkilön tiedot\n</p> <p>${Date()}</p>`

  console.log(text)
  response.send(text)
})

const port = 3001

app.listen(port)
console.log(`Server running on port ${port}`)
