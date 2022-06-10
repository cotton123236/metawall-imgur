const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
const connector = require('./connections/connector')
const errors = require('./utils/errors')
const status = require('./utils/status')

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const postsRouter = require('./routes/posts')
const uploadRouter = require('./routes/upload')

const {
  createError,
  handleExpectedErrors,
  handleUncaughtException,
  handleUnhandledRejection
} = errors


// connect to database
connector('hotel')

// express
const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(cors())

// routes
app.use('/', indexRouter)
app.use('/api/users', usersRouter)
app.use('/api/posts', postsRouter)
app.use('/api/upload', uploadRouter)
app.use((req, res, next) => next(createError(status.notFound)))

// error handle
app.use(handleExpectedErrors)

// catch process errors
process.on('uncaughtException', handleUncaughtException)
process.on('unhandledRejection', handleUnhandledRejection)

module.exports = app