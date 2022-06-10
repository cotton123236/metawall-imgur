const status = {
  success: {
    code: 200,
    message: 'success'
  },

  error: {
    code: 400,
    message: 'Cannot find data or format error.'
  },

  errorId: {
    code: 400,
    message: 'Cannot find data by id.'
  },

  errorField: {
    code: 400,
    message: 'Some field is required.'
  },

  errorAuth: {
    code: 401,
    message: 'Authorization error.'
  },

  errorUpload: {
    code: 400,
    message: 'Please upload file.'
  },

  notFound: {
    code: 404,
    message: '404 Cannot find this page.'
  }
}


module.exports = status