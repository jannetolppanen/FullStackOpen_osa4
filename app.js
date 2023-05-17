const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./utils/config')
const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')
mongoose.connect(config.MONGODB_URI)

app.use(middleware.requestLogger)
app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogsRouter)

module.exports = app