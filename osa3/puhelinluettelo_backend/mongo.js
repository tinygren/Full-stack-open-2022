const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]                //    id878gbrVQY6HsVZ
const name = process.argv[3]
const number = process.argv[4]

//const url = `mongodb+srv://timonygren_db_user:${password}@cluster0.hpoizdi.mongodb.net/?appName=Cluster0`
//const url = `mongodb+srv://timonygren_db_user:${password}@cluster0.hpoizdi.mongodb.net/noteApp?appName=Cluster0`
const url = `mongodb+srv://timonygren_db_user:${password}@cluster0.hpoizdi.mongodb.net/peopleApp?appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 })

// const noteSchema = new mongoose.Schema({
//   content: String,
//   important: Boolean,
// })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

//const Note = mongoose.model('Note', noteSchema)
const Person = mongoose.model('Person', personSchema)

if (!name || !number) {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  } )
} else {
  const person = new Person({
    name: name,
    number: number,
  })

  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)

    mongoose.connection.close()
  })
}

// const note = new Note({
//   content: 'Menen kotiin siivoamaan ... ?',
//   important: false,
// })

// note.save().then(result => {
//   console.log('note saved!')
//   mongoose.connection.close()
// })

// Note.find({ important: false}).then(result => {
//   result.forEach(note => {
//     console.log(note)
//   })
//   mongoose.connection.close()
// })
// Person.find({}).then(result => {
//   result.forEach(person => {
//     console.log(person)
//   })
//   mongoose.connection.close()
// } )