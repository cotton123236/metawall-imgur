const mongoose = require('mongoose')
const { Schema, model } = mongoose


const postSchema = new Schema({
  content: {
    type: String,
    required: [true, 'field "content" is required']
  },
  image: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now,
    // select: false
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'field "user" is required']
  },
  likes: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'User'
    }
  ]
}, {
  versionKey: false
})

const Post = model('Post', postSchema)


module.exports = Post