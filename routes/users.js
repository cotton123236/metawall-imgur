const express = require('express')
const auth = require('./../middlewares/auth')
const usersController = require('./../controllers/usersController')


const router = express.Router()

// get all user
router.get('/', usersController.getAll)
// get user profile
router.get('/profile/:id', auth, usersController.getProfile)
// patch user profile
router.patch('/profile', auth, usersController.updateProfile)
// user sign up
router.post('/sign_up', usersController.signUp)
// user sign in
router.post('/sign_in', usersController.signIn)
// user update password
router.patch('/password', auth, usersController.updatePassword)

module.exports = router
