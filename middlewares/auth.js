const User = require('./../models/usersModel')
const status = require('./../utils/status')
const errors = require('./../utils/errors')
const {
  decodeJWT
} = require('./../utils/utils')

const { createError, captureError } = errors

// auth middleware
const auth = captureError(async (req, res, next) => {
  const { authorization } = req.headers

  console.log(authorization);
  // 確認 headers 是否夾帶 token
  if (!authorization || !authorization.startsWith('Bearer')) return next(createError(status.errorAuth))
  const token = authorization.split(' ')[1]

  if (!token) return next(createError(status.errorAuth))

  const decodedToken = decodeJWT(token)
  if (!decodedToken) return next(createError(status.errorAuth))
  
  const user = await User.findById({ _id: decodedToken.id })
  req.user = user
  next()
})


module.exports = auth