const express = require('express')
const postsController = require('./../controllers/postsController')


const router = express.Router()

// get all
router.get('/', postsController.getAll)
// get by id
router.get('/:id', postsController.getById)
// post one or many
router.post('/', postsController.postOneOrMany)
// delete all
router.delete('/', postsController.deleteAll)
// delete by id
router.delete('/:id', postsController.deleteById)
// patch by id
router.patch('/:id', postsController.patchById)



module.exports = router