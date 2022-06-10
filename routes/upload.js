const express = require('express')
const auth = require('./../middlewares/auth')
const upload = require('./../middlewares/image')
const usersController = require('./../controllers/usersController')
const uploadController = require('./../controllers/uploadController')


const router = express.Router()

// upload image
router.post('/', auth, upload, uploadController.uploadImage)


module.exports = router