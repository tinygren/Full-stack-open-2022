

//Ladataan ympäristömuuttujat käyttöön heti index.js-tiedoston alussa, jolloin ne tulevat käyttöön koko sovellukselle
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
//path moduuli tiedostopolkujen käsittelyyn
const path = require('path')
// On tärkeää, että dotenv otetaan käyttöön ennen modelin person importtaamista
const Person = require('./models/person')

const app = express()
//TÄTÄ ei enään tarvita ,jos frontendissä on Proxy määriteltynä vite.config.js tiedostossa.
// Poistetaan siis viittaukset cors-kirjastoon backendin index.js-tiedostosta, ja poistetaan cors projektin riippuvuuksista:
// npm remove cors
// // Otetaan käyttöön CORS .
// if (process.env.NODE_ENV !== 'production') {
//   const cors = require('cors')
//   app.use(cors())
// }

// Otetaan käyttöön JSON-muotoisen datan käsittely
app.use(express.json())

// Luo oma Morgan-token:
morgan.token('body', (request) => {
  return JSON.stringify(request.body)
})
// Käytetään Morganin middlewarea, joka loggaa HTTP-pyynnöt konsoliin

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// 3. Esimerkki reitistä
app.get('/', (req, res) => {
  res.send('Greetings from backend!')
})

app.get('/api/people', (request, response, next) => {
  Person.find({})
    .then(people => {
      response.json(people)
    })
    .catch(error => next(error))
})

app.get('/api/people/:id', (request, response, next) => {
  const id = request.params.id
  Person.findById(id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
    .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
  const date = new Date()
  Person.countDocuments({})
    .then(count => {
      response.send(`<p>Phonebook has info for ${count} people</p><p>${date}</p>`)
    })
    .catch(error => next(error))
})

app.delete('/api/people/:id', (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndDelete(id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/people', (request, response, next) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ error: 'name missing' })
  }
  if (!body.number) {
    return response.status(400).json({ error: 'number missing' })
  }
  const person = new Person({
    name: body.name,                        // id: getRandomInt(100, 1000).toString(),
    number: body.number
  })
  person.save().then(savedPerson =>
    response.json(savedPerson))
    .catch(error => next(error))           // ⬅️ TÄRKEÄ
})

app.put('/api/people/:id', (request, response, next) => {
  const { name, number } = request.body
  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).end()
      }
      person.name = name       //päivitetään muistiinpanon tiedot
      person.number = number

      return person.save().then((updatedPerson) => {   //tallennetaan päivitetty muistiinpano tietokantaan
        response.json(updatedPerson)
      })
    })
    .catch(error => next(error))       // ⬅️ TÄRKEÄ
})
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'), err => {
    if (err) {
      res.status(500).send(err)
    }
  })
})
// Error handling middleware
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
// olemattomien osoitteiden käsittely
app.use(unknownEndpoint)

// Virheidenkäsittelymiddleware
app.use((error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'malformatted id' })
  }
  next(error)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})