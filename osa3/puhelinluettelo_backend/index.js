
// 1. Tuodaan tarvittavat paketit
const express = require('express')
const morgan = require('morgan')
const cors = require('cors') 
const app = express()

app.use(cors())
// Otetaan käyttöön JSON-muotoisen datan käsittely
app.use(express.json())

// Luo oma Morgan-token:
morgan.token('body', (req, res) => { 
  return JSON.stringify(req.body) 
})
// Käytetään Morgania:
// app.use(morgan('tiny')); // tavallinen
// app.use(morgan(':method :url :status :response-time ms :body', {
//   skip: (req) => req.method !== 'POST'
// }));

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

// 2. Luodaan alustava data
let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",    
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
    {       
    id: "3",    
    name: "Dan Abramov",
    number: "12-43-234345", 
    },
    {       
    id: "4",    
    name: "Mary Poppendieck",
    number: "39-23-6423122", 
    },  
    {
    id: "5",
    name: "Timo Timo",
    number: "050-1234567",
  },
  {
    id: "6",
    name: "Matti Meikäläinen",
    number: "050-7654321",
  },
  {
    id: "7",
    name: "Teppo Testaaja",
    number: "040-9876543",
  }
  
]
// 3. Esimerkki reitistä
app.get('/', (req, res) => {
  res.send('Greetings from backend!');
});

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.get('/info', (request, response) => {
  const date = new Date()
  response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); 
  // The maximum is exclusive and the minimum is inclusive
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
      return response.status(400).json({ error: 'name missing' })
  }
  if (!body.number) {
    return response.status(400).json({ error: 'number missing' })
  }

  if (persons.find(person => person.name === body.name)) {
    return response.status(400).json({ error: 'name must be unique' })
  }

  const person = {
    id: getRandomInt(100, 1000).toString(),
    name: body.name,
    number: body.number    
  }

  persons = persons.concat(person)
  // moderni tapa tehdä sama : persons = [...persons, person]

  response.status(201).json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})