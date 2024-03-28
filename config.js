require('dotenv').config()

const isCacheEnabled =
  process.env.ENVIRONMENT !== 'test' && !!process.env.REDIS_URL

module.exports = {
  isCacheEnabled,
}
