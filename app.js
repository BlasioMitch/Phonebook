const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const server = express()
const cors = require('cors')
const usersRouter = require('./controllers/users')
const contactsRouter = require('./controllers/contacts')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery',false)

logger.info(`Connecting to `, config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('Connected to MongoDB')
    })
    .catch((error) => {
        logger.error(`Error connecting to MongoDB: ${error.message} `)
    })


server.use(cors())
server.use(express.static('build'))
server.use(express.json())
server.use(middleware.requestLogger)
server.use('/api/users', usersRouter)
server.use('/api/contacts', contactsRouter)
server.use('/api/login', loginRouter)
server.use(middleware.unknownEndpoint)
server.use(middleware.errorHandler)

module.exports = server