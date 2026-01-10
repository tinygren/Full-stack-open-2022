const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url, { family: 4 })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

// const personSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     minlength: [3, 'Name must be at least 3 characters long, got {VALUE}'],
//     required: true
//   },
//   number: {
//     type:String,
//     minlength: [8, 'Number must be at least 8 characters long, got {VALUE}'],
//     required: true
//   }
// })
// Custom validator using
const Schema = mongoose.Schema
const personSchema = new Schema({
  name: {
    type: String,
    minlength: [3, 'Name must be at least 3 characters long, got {VALUE}'],
    required: true
  },
  number: {
    type: String,
    validate: {
      validator: function (v) {
        return /^\d{2,3}-\d{6,}$/.test(v)
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: [true, 'User phone number required']
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
module.exports = mongoose.model('Person', personSchema)

//On useita tapoja määritellä ympäristömuuttujan arvo. Voimme esim. antaa sen ohjelman käynnistyksen yhteydessä seuraavasti:

//MONGODB_URI="osoite_tahan" npm run dev
