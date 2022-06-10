const multer = require('multer')
const path = require('path')

const upload = multer({
  limits: {
    fileSize: 2 * 1024 * 1024
  },
  fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase()
    // check is legal image ext
    if (ext !== '.jpg' && ext !== '.png' && ext !== '.jpeg') {
      cb(new Error('illegal image file. Please upload ".jpg"、".jpeg"、".png" file.'))
    }
    cb(null, true)
  }
}).any()

module.exports = upload