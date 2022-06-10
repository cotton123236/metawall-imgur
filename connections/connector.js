const mongoose = require('mongoose')
const dotenv = require('dotenv')


dotenv.config({ path: './config.env' })

const { DATABASE_URL, DATABASE_PASSWORD } = process.env

const connector = (dbname) => {
  const url = DATABASE_URL
  .replace('<password>', DATABASE_PASSWORD)
  .replace('<dbname>', dbname)

  mongoose.connect(url)
  .then(() => console.log('connected'))
  .catch((err) => console.log(err.message))
}


module.exports = connector