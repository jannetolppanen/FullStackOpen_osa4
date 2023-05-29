const http = require('http')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./utils/config')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
mongoose.connect(config.MONGODB_URI)

app.use(middleware.requestLogger)
app.use(cors())
app.use(express.json())
// using tokenExtractor only on api/blogs. Lets see if it gives us problems later on
// app.use(middleware.tokenExtractor)
app.use('/api/login', loginRouter)
app.use('/api/blogs', middleware.tokenExtractor, blogsRouter)
app.use('/api/users', usersRouter)
app.use(middleware.errorHandler)

module.exports = app