const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const { JWT_EXPIRES_DAY, JWT_SECRET } = process.env

// 加密密碼
const bcryptPassword = async (password) => await bcrypt.hash(password, 12)

// 比對密碼
const comparePassword = async (password, secondPassword) => await bcrypt.compare(password, secondPassword)

// 產生 JWT
const createJWT = (id) => (
  jwt.sign(
    { id },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_DAY }
  )
)

// 解密 JWT
const decodeJWT = (token) => jwt.verify(token, JWT_SECRET)


module.exports = {
  bcryptPassword,
  comparePassword,
  createJWT,
  decodeJWT
}