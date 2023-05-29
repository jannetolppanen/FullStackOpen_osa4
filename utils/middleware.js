const morgan = require('morgan')
const requestLogger = morgan('tiny')
const logger = require('./logger')

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    } else if (error.name ===  'JsonWebTokenError') {
      return response.status(400).json({ error: 'token missing or invalid' })
    }
  
    next(error)
  }

  const tokenExtractor = (request, response, next) => {
    logger.info("tokenextractor called")
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
      request.token = authorization.replace('Bearer ', '')
    }
    next()
  }

module.exports = {
    requestLogger,
    errorHandler,
    tokenExtractor
}