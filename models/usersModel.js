const mongoose = require('mongoose')
const { Schema, model } = mongoose


const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'field "name" is required.']
  },
  email: {
    type: String,
    required: [true, 'field "email" is required.'],
    unique: true,
    lowercase: true,
    select: false,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'field "password" is required.'],
    minlength: 8,
    select: false,
    trim: true
  },
  gender: {
    // 男性存 0，女性存 1，未定義存 2
    type: Number,
    default: 2,
    enum: [0, 1, 2],
  },
  avatar: {
    type: String,
    trim: true
  },
  likes: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Post'
    }
  ],
  follows: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'User'
    }
  ]
}, {
  versionKey: false
})

const User = model('User', userSchema)


module.exports = User