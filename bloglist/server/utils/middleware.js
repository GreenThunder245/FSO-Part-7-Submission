const logger = require('./logger')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const User = require('../models/user')

const errorHandler = (error, request, response, next) => {
  logger.error('FULL ERROR',error)
  logger.error('ERROR MESSAGE',error.message)
  logger.error('ERROR NAME',error.name)

  if(error.name === 'ValidationError'){
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
      request.token = authorization.replace('Bearer ', '')
    } else {
      request.token = null
    }
  next()
}

const userExtractor = async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, config.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  request.user = await User.findById(decodedToken.id)
  next()
}

module.exports = {
  errorHandler,
  tokenExtractor,
  userExtractor
}