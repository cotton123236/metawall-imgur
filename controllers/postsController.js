const Post = require('./../models/postsModel')
const responser = require('../utils/responser')
const errors = require('./../utils/errors')
const status = require('../utils/status')


const { success } = responser
const { createError, captureError } = errors

// get all
const getAll = captureError(async (req, res, next) => {
  const timesort = req.query.sort === 'hot' ? { likes: -1 } : req.query.sort === 'timeasc' ? 'createdAt' : '-createdAt'
  const query = req.query.content ? { 'content': new RegExp(req.query.content) } : {}
  const data = await Post.find(query)
  .populate({
    path: 'user',
    select: 'name image'
  })
  .sort(timesort)
  success(res, data)
})

// get one by id
const getById = captureError(async (req, res, next) => {
  const { id } = req.params
  const data = await Post.findById(id)
  if (data) success(res, [data])
  else return next(createError(status.errorId))
})

// post one or many
const postOneOrMany = captureError(async (req, res, next) => {
  const { body } = req
  const isArray = Array.isArray(body)
  const getContent = (item) => {
    const { user, content, image, likes } = item
    // if (!user || !content) return next(createError(status.errorField))
    return { user, content, image, likes }
  }
  // create data
  let data
  // post many
  if (isArray) {
    const items = []
    body.forEach(item => items.push(getContent(item)))
    data = await Post.insertMany(items)
  }
  // post one
  else {
    data = [await Post.create(getContent(body))]
  }
  success(res, data)
})

// delete all
const deleteAll = captureError(async (req, res, next) => {
  await Post.deleteMany({})
  const data = await Post.find()
  success(res, data)
})

// delete by id
const deleteById = captureError(async (req, res, next) => {
  const { id } = req.params
  const data = [await Post.findByIdAndDelete(id)]
  if (data) success(res, [data])
  else return next(createError(status.errorId))
})

// patch by id
const patchById = captureError(async (req, res, next) => {
  const { body } = req
  const { id } = req.params
  const { user, content } = body
  // create patches data
  const patches = {}
  if (!user && !content) {
    return next(createError(status.errorField))
  }
  if (user) patches.user = user
  if (content) patches.content = content
  // update
  await Post.findByIdAndUpdate(id, patches)
  const data = await Post.findById(id)
  if (data) success(res, [data])
  else return next(createError(status.errorId))
})


module.exports = {
  getAll,
  getById,
  postOneOrMany,
  deleteAll,
  deleteById,
  patchById
}