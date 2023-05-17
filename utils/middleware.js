const morgan = require('morgan')
const requestLogger = morgan('tiny')

module.exports = {
    requestLogger
}