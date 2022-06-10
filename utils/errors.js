const responser = require('./../utils/responser')


const defaultErrorOptions = {
  code: 500,
  operational: true,
  message: 'cannot find data or format error.'
}

// create a custom new Error
const createError = (options) => Object.assign(new Error(), defaultErrorOptions, options)

// capture errors from plugins (async)
const captureError = (fn) => (req, res, next) => {
  fn(req, res, next).catch(err => next(err))
}

// handle all expected errors and response
const handleExpectedErrors = (err, req, res, next) => {
  err.code = err.code || 500
  // dev
  if (process.env.NODE_ENV === 'dev') {
    return responser.devError(res, err)
  }
  // production
  if (err.name === 'ValidationError') {
    err.message
    err.operational = true
    return responser.prodError(res, err)
  }
  responser.prodError(res, err)
}

// recording errors to logs and exit process (for uncaughtException)
const handleUncaughtException = (err) => {
  console.error('Uncaughted Exception！')
	console.error(err)
	process.exit(1)
}

// recording errors to logs (for unhandledRejection)
const handleUnhandledRejection = (reason, promise) => {
  console.error('uncaugth rejection：', promise, 'reason：', reason)
}


module.exports = {
  createError,
  captureError,
  handleExpectedErrors,
  handleUncaughtException,
  handleUnhandledRejection
}