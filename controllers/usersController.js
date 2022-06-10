const validator = require('validator')
const User = require('./../models/usersModel')
const responser = require('../utils/responser')
const status = require('../utils/status')
const errors = require('../utils/errors')
const {
  bcryptPassword,
  comparePassword,
  createJWT
} = require('./../utils/utils')


const { success } = responser
const { createError, captureError } = errors

// get all
const getAll = captureError(async (req, res, next) => {
  const data = await User.find()
  success(res, data)
})

// 註冊
const signUp = captureError(async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body
  // 驗證
  if (!name || !email || !password || !confirmPassword) {
    return next(createError(status.errorField))
  }
  if(password !== confirmPassword){
    return next(createError({
      code: 400,
      message: 'Field "password" & "confirmPassword" is different.'
    }))
  }
  if (!validator.isLength(name, { min: 2 })) {
    return next(createError({
      code: 400,
      message: 'Field "name" needs at least 2 characters.'
    }))
  }
  if (!validator.isEmail(email)) {
    return next(createError({
      code: 400,
      message: 'Field "email" format error.'
    }))
  }
  if (!validator.isLength(password, { min: 8 })) {
    return next(createError({
      code: 400,
      message: 'Field "password" needs at least 8 characters.'
    }))
  }
  const isEmailExist = await User.findOne({ email })
  if (isEmailExist) {
    return next(createError({
      code: 400,
      message: 'Email has been registered.'
    }))
  }
  // 密碼加密
  const hash = await bcryptPassword(password)
  const user = await User.create({ name, email, password: hash })

  res.status(201).send({
    status: 'success',
    token: createJWT(user._id)
  })
})

// 登入
const signIn = captureError(async (req, res, next) => {
  const { email, password } = req.body
  // 基本驗證
  if (!email || !password) {
    return next(createError(status.errorField))
  }
  const user = await User.findOne({ email }).select('+password')
  if (!user) {
    return next(createError({
      code: 400,
      message: 'Please sign up first.'
    }))
  }
  // 比對密碼
  const isPasswordCorrect = await comparePassword(password, user.password)
  if (!isPasswordCorrect) {
    return next(createError({
      code: 400,
      message: 'Field "email" or "password" is wrong.'
    }))
  }

  res.status(201).send({
    status: 'success',
    token: createJWT(user._id)
  })
})

// 更新密碼
const updatePassword = captureError(async (req, res, next) => {
  const { user: reqUser } = req
  const { password, confirmPassword } = req.body
  // 基本驗證
  if (!password || !confirmPassword) {
    return next(createError(status.errorField))
  }
  if(password !== confirmPassword){
    return next(createError({
      code: 400,
      message: 'Field "password" & "confirmPassword" is different.'
    }))
  }
  if (!validator.isLength(password, { min: 8 })) {
    return next(createError({
      code: 400,
      message: 'Field "password" needs at least 8 characters.'
    }))
  }
  // 若與舊密碼一樣
  const user = await User.findOne({ _id: reqUser.id }).select('+password')
  const isPasswordTheSame = await comparePassword(password, user.password)
  if (isPasswordTheSame) {
    return next(createError({
      code: 400,
      message: 'Please enter new password.'
    }))
  }
  // 加密新密碼
  const hash = await bcryptPassword(password)
  await User.updateOne({ _id: reqUser._id }, { password: hash })

  res.status(201).send({
    status: 'success',
    message: 'Update password success.'
  })
})

// 取得個人資料 by id
const getProfile = captureError(async (req, res, next) => {
  const { id } = req.params
  if (!id) return next(createError(status.errorId))

  const isUserExist = await User.findById(id)
  if (!isUserExist) return next(createError(status.errorId))

  success(res, isUserExist)
})

// 修改個人 profile
const updateProfile = captureError(async (req, res, next) => {
  const { user } = req
  const { name, gender: genderStr, avatar } = req.body
  // 基本驗證
  if (!name) {
    return next(createError(status.errorField))
  }
  if (!validator.isLength(name, { min: 2 })) {
    return next(createError({
      code: 400,
      message: 'Field "name" needs at least 2 characters.'
    }))
  }
  const gender = parseInt(genderStr)
  if (gender !== 0 && gender !== 1 && gender !== 2) {
    return next(createError({
      code: 400,
      message: 'Field "gender" is not expected value.'
    }))
  }
  if (avatar && validator.isURL(avatar, { protocols: ['https'] })) {
    return next(createError({
      code: 400,
      message: 'Field "avatar" url is wrong.'
    }))
  }
  // update
  const pathcData = {
    name,
    gender
  }
  if (avatar) pathcData.avatar = avatar
  const data = await User.findByIdAndUpdate(user.id, pathcData, { new: true })

  res.status(201).send({
    status: 'success',
    data
  })
})


module.exports = {
  getAll,
  signUp,
  signIn,
  updatePassword,
  getProfile,
  updateProfile
}