const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const loginRouter = require('./controllers/login')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')


const app = express()

const mongoUrl = config.MONGODB_URI
const PORT = config.PORT

logger.info('connecting to', mongoUrl)

mongoose
    .set('strictQuery', false)
    .connect(mongoUrl, { family: 4 })
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB:', error.message)
    })

//app.use(express.static('dist'))     // not needed for backend only

app.use(express.json())
app.use(middleware.tokenExtractor)                    // added middleware for token extraction
app.use(middleware.requestLogger)
app.use('/api/login', loginRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app