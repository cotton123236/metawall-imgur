const { ImgurClient } = require('imgur')
// const size = require('image-size')
const responser = require('../utils/responser')
const errors = require('../utils/errors')
const status = require('./../utils/status')


const { createError, captureError } = errors
const { success } = responser
const {
  IMGUR_CLIENT_ID,
  IMGUR_CLIENT_SECRET,
  IMGUR_REFRESH_TOKEN,
  IMGUR_ALBUN_ID
} = process.env

const uploadImage = captureError(async (req, res, next) => {
  const { files } = req
  if (!files || !files.length) {
    return next(createError(status.errorUpload))
  }
  // const dimensions = size(req.files[0].buffer)
  // if (dimensions.width !== dimensions.height) {
  //   return next(createError({
  //     code: 400,
  //     message: 'image\'s width and height must have be 1:1.'
  //   }));
  // }
  const client = new ImgurClient({
    clientId: IMGUR_CLIENT_ID,
    clientSecret: IMGUR_CLIENT_SECRET,
    refreshToken: IMGUR_REFRESH_TOKEN
  })
  const response = await client.upload({
    image: files[0].buffer.toString('base64'),
    type: 'base64',
    album: IMGUR_ALBUN_ID
  })
  success(res, response.data.link)
})

module.exports = {
  uploadImage
}