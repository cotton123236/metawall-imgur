const status = require('./status')

const success = (res, data) => {
  res.send({
    status: 'success',
    data
  })
}

const devError = (res, error) => {
  const { code, message, stack } = error
  res.status(code).send({
    status: 'error',
    message,
    stack,
    error
  })
}

const prodError = (res, error) => {
  const { code, message } = error
  res.status(code).send({
    status: 'error',
    message
  })
}


module.exports = {
  success,
  devError,
  prodError
}